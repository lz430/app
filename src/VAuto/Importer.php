<?php

namespace DeliverMyRide\Vauto;

use App\Feature;
use App\JATO\Make;
use App\JATO\Manufacturer;
use App\JATO\VehicleModel;
use App\JATO\Version;
use App\VersionDeal;
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
        foreach ($this->filesystem->files(base_path(config('services.vauto.uploads_path'))) as $file) {
            $handle = fopen($file, 'r');

            $this->checkHeaders(fgetcsv($handle));

            $this->saveVersionDeals($handle, md5_file($file));
        };
    }

    private function saveVersionDeals($handle, string $fileHash)
    {
        $dealIds = [];

        while (($data = fgetcsv($handle)) !== false) {
            $keyedData = $this->keyedArray($data);

            try {
                $decoded = $this->client->decodeVin($keyedData['VIN']);

                DB::transaction(function () use ($decoded, $keyedData, $fileHash, &$dealIds) {
                    // Get versions that match the Vin
                    $versions = $this->client->modelsVersionsByModelName(
                        str_replace(' ', '-', strtolower($keyedData['Model']))
                    );

                    // save manufacturer, make, model, then versions
                    $manufacturerName = basename(array_first($versions[0]['links'], function ($link) {
                        return $link['rel'] === 'getManufacturer';
                    })['href']) ?? null;

                    $makeName = basename(array_first($versions[0]['links'], function ($link) {
                        return $link['rel'] === 'getMake';
                    })['href']) ?? null;

                    $modelName = basename(array_first($versions[0]['links'], function ($link) {
                        return $link['rel'] === 'getModel';
                    })['href']) ?? null;


                    if (! $manufacturerName) {
                        // log this and handle
                    } elseif (! $modelName) {
                        // log this and handle
                    }

                    // Get and save new manufacturer
                    if (! $manufacturer = Manufacturer::where('url_name', $manufacturerName)->first()) {
                        $manufacturer = $this->saveManufacturer(
                            $this->client->manufacturerByName($manufacturerName)
                        );
                    }

                    // Get and save new make
                    if (! $make = Make::where('url_name', $makeName)->first()) {
                        $make = $this->saveManufacturerMake(
                            $manufacturer,
                            $this->client->makeByName($makeName)
                        );
                    }

                    // Get and save new model
                    if (! $model = VehicleModel::where('url_name', $modelName)->first()) {
                        $model = $this->saveMakeModel(
                            $make,
                            $this->client->modelByName($modelName)
                        );
                    }

                    // Save new versions
                    foreach ($versions as $version) {
                        $this->saveModelVersionAndOptionsAndTaxesAndDiscounts($model, $version);
                    }

                    foreach (Version::whereIn(
                        'jato_uid',
                        collect($decoded['versions'])->pluck('uid')
                    )->get() as $version) {
                        /** @var VersionDeal $versionDeal */
                        $versionDeal = $this->saveVersionDeal($version, $fileHash, $keyedData);
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
                });
            } catch (ClientException | ServerException $e) {
                // log and handle
                $this->info($e->getMessage());
            }
        }

        VersionDeal::whereNotIn('id', $dealIds)->delete();
    }

    private function saveVersionDealPhotos(VersionDeal $versionDeal, string $photos)
    {
        collect(explode('|', $photos))->each(function ($photoUrl) use ($versionDeal) {
            $versionDeal->photos()->firstOrCreate(['url' => str_replace('http', 'https', $photoUrl)]);
        });
    }

    private function saveVersionDeal(Version $version, string $fileHash, array $keyedData)
    {
        $this->info("Saving deal for vin: {$keyedData['VIN']}");

        return $version->deals()->updateOrCreate([
            'file_hash' => $fileHash,
            'dealer_id' => $keyedData['DealerId'],
            'stock_number' => $keyedData['Stock #'],
        ], [
            'file_hash' => $fileHash,
            'dealer_id' => $keyedData['DealerId'],
            'stock_number' => $keyedData['Stock #'],
            'vin' => $keyedData['VIN'],
            'new' => $keyedData['New/Used'] === 'Y',
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
            $this->error(
                'Error retrieving information for vehicleID: ' . $version['vehicleId']
            );
        }
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
}
