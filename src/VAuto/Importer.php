<?php

namespace DeliverMyRide\Vauto;

use App\Feature;
use App\Incentive;
use App\JATO\Equipment;
use App\JATO\Make;
use App\JATO\Manufacturer;
use App\JATO\Option;
use App\JATO\VehicleModel;
use App\JATO\Version;
use App\Deal;
use Carbon\Carbon;
use DeliverMyRide\JATO\Client;
use GuzzleHttp\Exception\ClientException;
use GuzzleHttp\Exception\ServerException;
use Illuminate\Database\QueryException;
use Illuminate\Filesystem\Filesystem;
use Illuminate\Support\Facades\DB;

class Importer
{
    private const HEADERS = [
        "DealerId",
        "Stock #",
        "VIN",
        "New/Used",
        "Year",
        "Make",
        "Model",
        "Model Code",
        "Body",
        "Transmission",
        "Series",
        "Series Detail",
        "Door Count",
        "Odometer",
        "Engine Cylinder Ct",
        "Engine Displacement",
        "Drivetrain Desc",
        "Colour",
        "Interior Color",
        "Price",
        "MSRP",
        "Inventory Date",
        "Certified",
        "Description",
        "Features",
        "City MPG",
        "Highway MPG",
        "Photo Count",
        "Photos",
        "Photos Last Modified Date",
        "Dealer Name",
        "Engine",
        "Fuel",
        "Age",
    ];

    private $filesystem;
    private $client;
    private $info;

    public function __construct(Filesystem $filesystem, Client $client)
    {
        $this->filesystem = $filesystem;
        $this->client = $client;
    }

    public function setInfoFunction(callable $infoFunction)
    {
        $this->info = $infoFunction;
    }

    private function info(string $info)
    {
        if ($this->info) {
            call_user_func($this->info, $info);
        }
    }

    public function import()
    {
        $csvFiles = array_filter(
            $this->filesystem->files(realpath(base_path(config('services.vauto.uploads_path')))),
            function ($file) {
                return pathinfo($file, PATHINFO_EXTENSION) === 'csv';
            }
        );

        foreach ($csvFiles as $file) {
            $handle = fopen($file, 'r');

            $this->checkHeaders(fgetcsv($handle));

            $this->saveVersionDeals($handle, md5_file($file));
        };
    }

    private function getLinkRel($from, $rel)
    {
        return array_first($from, function ($link) use ($rel) {
            return $link['rel'] === $rel;
        })['href'];
    }

    private function saveVersionDeals($handle, string $fileHash)
    {
        $dealIds = [];

        $line = 1;
        while (($data = fgetcsv($handle)) !== false) {
            $keyedData = $this->keyedArray($data);

            $this->info("VAuto vehicle #{$line}");
            $line += 1;

            // skip if file hash + vin is already in db
            if (Deal::where('file_hash', $fileHash)->where('vin', $keyedData['VIN'])->first()) {
                continue;
            }

            // skip deal if it is not new
            if ($keyedData['New/Used'] !== 'N') {
                continue;
            }

            $versionDeal = $this->saveDeal($fileHash, $keyedData);

            try {
                $decoded = $this->client->decodeVin($keyedData['VIN']);

                $versionIds = array_map(function ($version) {
                    return $version['uid'];
                }, $decoded['versions']);

                $normalizeModelName = function ($modelName) {
                    $modelName = str_replace(' ', '-', strtolower($modelName));

                    // Weird model names
                    if ($modelName === 'all-new-compass;-compass') {
                        return 'compass';
                    }

                    return $modelName;
                };

                // Get versions that match the Vin
                $versions = array_values(array_filter($this->client->modelsVersionsByModelName(
                    $normalizeModelName($decoded['model'])
                ), function ($version) use ($versionIds) {
                    return in_array($version['uid'], $versionIds);
                }));

                if (empty($versions)) {
                    continue;
                }

                DB::transaction(function () use ($versions, $versionDeal, $decoded, $keyedData, $fileHash, &$dealIds) {
                    // Save new versions
                    $manufacturerName = basename($this->getLinkRel($versions[0]['links'], 'getManufacturer'));
                    $makeName = basename($this->getLinkRel($versions[0]['links'], 'getMake'));
                    $modelName = basename($this->getLinkRel($versions[0]['links'], 'getModel'));

                    // Save/Update manufacturer, make, model, then versions
                    $manufacturer = $this->saveManufacturer(
                        $this->client->manufacturerByName($manufacturerName)
                    );

                    // Save/Update and save new make
                    $make = $this->saveManufacturerMake(
                        $manufacturer,
                        $this->client->makeByName($makeName)
                    );

                    // Save/Update and save new model
                    $model = $this->saveMakeModel(
                        $make,
                        $this->client->modelByName($modelName)
                    );

                    foreach ($versions as $versionArray) {
                        // Save/Update version and options and taxes and discounts
                        $version = $this->saveModelVersionAndOptionsAndTaxesAndDiscounts($model, $versionArray);

                        // Attach version to deal
                        $versionDeal->versions()->attach($version->id);

                        $dealIds[] = $versionDeal->id;

                        $features = collect(explode('|', $keyedData['Features']));
                        $features->map(function ($featureName) use ($versionDeal) {
                            $feature = Feature::updateOrCreate([
                                'feature' => $featureName,
                            ], [
                                'feature' => $featureName,
                                'group' => Feature::getGroupForFeature($featureName),
                            ]);

                            try {
                                $feature->deals()->save($versionDeal);
                            } catch (QueryException $e) {
                                // Already saved.
                            }
                        });

                        $this->saveVersionDealPhotos(
                            $versionDeal,
                            $keyedData['Photos']
                        );
                    }

                    // Save Incentives (these require the versions to be saved)
                    $this->saveIncentives(
                        $versions[0]['vehicleId']
                    );
                });
            } catch (ClientException | ServerException $e) {
                $this->info('Error: ' . $e->getMessage());
            }
        }

        Deal::whereNotIn('id', $dealIds)->delete();
    }

    private function saveVersionDealPhotos(Deal $versionDeal, string $photos)
    {
        collect(explode('|', $photos))->each(function ($photoUrl) use ($versionDeal) {
            $versionDeal->photos()->firstOrCreate(['url' => str_replace('http', 'https', $photoUrl)]);
        });
    }

    private function saveDeal(string $fileHash, array $keyedData) : Deal
    {
        $this->info("Saving deal for vin: {$keyedData['VIN']}");

        $deal = Deal::updateOrCreate([
            'file_hash' => $fileHash,
            'vin' => $keyedData['VIN'],
        ], [
            'file_hash' => $fileHash,
            'dealer_id' => $keyedData['DealerId'],
            'stock_number' => $keyedData['Stock #'],
            'vin' => $keyedData['VIN'],
            'new' => $keyedData['New/Used'] === 'N',
            'year' => $keyedData['Year'],
            'make' => $keyedData['Make'],
            'model' => $keyedData['Model'],
            'model_code' => $keyedData['Model Code'],
            'body' => $keyedData['Body'],
            'transmission' => $keyedData['Transmission'],
            'series' => $keyedData['Series'],
            'series_detail' => $keyedData['Series Detail'],
            'door_count' => $keyedData['Door Count'],
            'odometer' => $keyedData['Odometer'],
            'engine' => $keyedData['Engine'],
            'fuel' => $keyedData['Fuel'],
            'color' => $keyedData['Colour'],
            'interior_color' => $keyedData['Interior Color'],
            'price' => $keyedData['Price'] !== '' ? $keyedData['Price'] : null,
            'msrp' => $keyedData['MSRP'] !== '' ? $keyedData['MSRP'] : null,
            'inventory_date' => Carbon::createFromFormat('m/d/Y', $keyedData['Inventory Date']),
            'certified' => $keyedData['Certified'] === 'Yes',
            'description' => $keyedData['Description'],
            'fuel_econ_city' => $keyedData['City MPG'] !== '' ? $keyedData['City MPG'] : null,
            'fuel_econ_hwy' => $keyedData['Highway MPG'] !== '' ? $keyedData['Highway MPG'] : null,
            'dealer_name' => $keyedData['Dealer Name'],
            'days_old' => $keyedData['Age'],
        ]);

        return $deal;
    }

    private function keyedArray(array $data)
    {
        return array_combine(self::HEADERS, $data);
    }

    private function checkHeaders(array $headers)
    {
        if (self::HEADERS !== $headers) {
            throw new MismatchedHeadersException(
                implode(', ', $headers) . ' does not match expected headers: ' . implode(', ', self::HEADERS)
            );
        }
    }

    private function saveModelVersion(VehicleModel $vehicleModel, array $version)
    {
        $this->info('Saving Model Version: ' . $version['vehicleId']);

        return $vehicleModel->versions()->updateOrCreate([
            'jato_uid' => $version['uid'],
            'year' => $version['modelYear'],
            'jato_model_id' => $version['modelId'],
        ], [
            'jato_vehicle_id' => $version['vehicleId'],
            'jato_uid' => $version['uid'],
            'jato_model_id' => $version['modelId'],
            'year' => $version['modelYear'],
            'name' => ! in_array($version['versionName'], ['-', ''])
                ? $version['versionName']
                : null,
            'trim_name' => $version['trimName'],
            'description' => rtrim($version['headerDescription'], ' -'),
            'driven_wheels' => $version['drivenWheels'],
            'doors' => $version['numberOfDoors'],
            'transmission_type' => $version['transmissionType'],
            'msrp' => $version['msrp'] !== '' ? $version['msrp'] : null,
            'invoice' => $version['invoice'] !== '' ? $version['invoice'] : null,
            'body_style' => $version['bodyStyleName'],
            'photo_path' => $version['photoPath'],
            'fuel_econ_city' => $version['fuelEconCity'] !== ''
                ? $version['fuelEconCity']
                : null,
            'fuel_econ_hwy' => $version['fuelEconHwy'] !== ''
                ? $version['fuelEconHwy']
                : null,
            'manufacturer_code' => ! in_array($version['manufacturerCode'], ['-', ''])
                ? $version['manufacturerCode']
                : null,
            'delivery_price' => $version['delivery'] !== ''
                ? $version['delivery']
                : null,
            'is_current' => $version['isCurrent'],
        ]);
    }

    private function saveModelVersionAndOptionsAndTaxesAndDiscounts(VehicleModel $vehicleModel, array $version)
    {
        try {
            $vehicleVersion = $this->saveModelVersion($vehicleModel, $version);

            $options = $this->client->optionsByVehicleId($vehicleVersion->jato_vehicle_id);
//            $equipment = $this->client->equipmentByVehicleId($vehicleVersion->jato_vehicle_id);

            $this->saveVersionTaxesAndDiscounts($vehicleVersion, $options['taxes']);
//            $this->saveVersionOptions($vehicleVersion, $options['options']);
//            $this->saveVersionEquipment($vehicleVersion, $equipment['results']);
        } catch (QueryException $e) {
            $this->info('Duplicate information (Ignoring).');
            $this->info($e->getMessage());
        } catch (ServerException $e) {
            $this->info(
                'Error retrieving information for vehicleID: ' . $version['vehicleId']
            );
        }

        return $vehicleVersion;
    }

    private function saveManufacturer(array $manufacturer)
    {
        $this->info('Saving Manufacturer: ' . $manufacturer['manufacturerName']);

        return Manufacturer::updateOrCreate([
            'url_name' => $manufacturer['urlManufacturerName'],
        ], [
            'name' => $manufacturer['manufacturerName'],
            'url_name' => $manufacturer['urlManufacturerName'],
            'is_current' => $manufacturer['isCurrent'],
        ]);
    }

    private function saveManufacturerMake(Manufacturer $manufacturer, array $make)
    {
        $this->info('Saving Manufacturer Make: ' . $make['makeName']);

        return $manufacturer->makes()->updateOrCreate([
            'url_name' => $make['urlMakeName'],
        ], [
            'name' => $make['makeName'],
            'url_name' => $make['urlMakeName'],
            'is_current' => $make['isCurrent'],
        ]);
    }

    private function saveMakeModel(Make $make, array $model)
    {
        $this->info('Saving Make Model: ' . $model['modelName']);

        return $make->models()->updateOrCreate([
            'url_name' => $model['urlModelName'],
        ], [
            'name' => $model['modelName'],
            'url_name' => $model['urlModelName'],
            'is_current' => $model['isCurrent'],
        ]);
    }


    private function saveVersionTaxesAndDiscounts(Version $version, array $taxesAndDiscounts)
    {
        $this->info("Saving Version Taxes and Discounts: $version->name");

        foreach ($taxesAndDiscounts as $taxOrDiscount) {
            $version->taxesAndDiscounts()->updateOrCreate([
                'name' => $taxOrDiscount['item1'],
                'version_id' => $version->id,
            ], [
                'name' => $taxOrDiscount['item1'],
                'version_id' => $version->id,
                'amount' => $taxOrDiscount['item2'],
            ]);
        }
    }

    private function saveVersionOptions(Version $version, $options)
    {
        $this->info("Saving Version Options: $version->name");

        foreach ($options as $option) {
            Option::updateOrCreate([
                'jato_option_id' => $option['optionId'],
                'jato_vehicle_id' => $version->id,
            ], [
                'name' => $option['optionName'],
                'code' => $option['optionCode'],
                'type' => $option['optionType'],
                'msrp' => $option['msrp'],
                'invoice' => $option['invoicePrice'],
                'discount' => $option['discount'],
                'state' => $option['optionState'],
                'state_translation' => $option['optionStateTranslation'],
                'description' => $option['optionDescription'],
            ]);
        }
    }

    private function saveVersionEquipment(Version $version, $equipments)
    {
        $this->info("Saving Version Equipment: $version->name");

        foreach ($equipments as $equipment) {
            Equipment::updateOrCreate([
                'jato_option_id' => $equipment['optionId'],
                'jato_vehicle_id' => $version->jato_vehicle_id,
            ], [
                'jato_option_id' => $equipment['optionId'],
                'jato_vehicle_id' => $version->jato_vehicle_id,
                'jato_schema_id' => $equipment['schemaId'],
                'jato_category_id' => $equipment['categoryId'],
                'category' => $equipment['category'],
                'name' => $equipment['name'],
                'location' => $equipment['location'],
                'availability' => $equipment['availability'],
                'value' => $equipment['value'],
            ]);
        }
    }

    private function saveIncentives($vehicleId)
    {
        $incentives = $this->client->incentivesByVehicleId($vehicleId);

        foreach ($incentives as $incentive) {
            try {
                $validFrom = new Carbon($incentive['validFrom']);
                $validTo = new Carbon($incentive['validTo']);
                $revisionDate = new Carbon($incentive['revisionDate']);
            } catch (\Exception $e) {
                // invalid dates
            }

            $this->info('Saving incentive: ' . $incentive['title']);

            try {
                $incentive = Incentive::create([
                    'makeName' => $incentive['makeName'],
                    'subProgramID' => $incentive['subProgramID'],
                    'title' => $incentive['title'],
                    'description' => $incentive['description'],
                    'categoryID' => $incentive['categoryID'],
                    'typeID' => $incentive['typeID'],
                    'targetID' => $incentive['targetID'],
                    'validFrom' => $validFrom ?? null,
                    'validTo' => $validTo ?? null,
                    'revisionNumber' => $incentive['revisionNumber'],
                    'revisionDescription' => $incentive['revisionDescription'],
                    'revisionDate' => $revisionDate ?? null,
                    'restrictions' => $incentive['restrictions'],
                    'comments' => $incentive['comments'],
                    'statusName' => $incentive['statusName'],
                    'statusID' => $incentive['statusID'],
                    'cash' => $incentive['cash'],
                    'cashRequirements' => $incentive['cashRequirements'],
                    'categoryName' => $incentive['categoryName'],
                    'targetName' => $incentive['targetName'],
                    'typeName' => $incentive['typeName'],
                    'states' => $incentive['states'],
                ]);

                $incentive->versions()->attach(
                    Version::where('jato_vehicle_id', $vehicleId)->pluck('id')
                );
            } catch (QueryException $e) {
                // duplicate
            }
        }
    }
}
