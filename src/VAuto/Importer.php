<?php

namespace DeliverMyRide\VAuto;

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
use function GuzzleHttp\Promise\unwrap;
use GuzzleHttp\Psr7\Response;
use Illuminate\Database\QueryException;
use Illuminate\Filesystem\Filesystem;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

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

    private function saveVersionDeals($handle, string $fileHash)
    {
        $row = 2;
        while (($data = fgetcsv($handle)) !== false) {
            $keyedData = $this->keyedArray($data);

            $this->info("VAuto import row: #{$row}");
            $row += 1;

            /**
             * Skip if it is not new.
             */
            if ($keyedData['New/Used'] !== 'N') {
                continue;
            }

            /**
             * Skip if vin is already in db and has a matching version
             */
            $savedDeal = Deal::where('vin', $keyedData['VIN'])->first();
            if ($savedDeal && $savedDeal->versions()->count() === 1) {
                continue;
            }

            try {
                $versionDeal = $this->saveDeal($fileHash, $keyedData);

                $decoded = $this->client->decodeVin($keyedData['VIN']);

                // If there is just 1 version then use that
                if (count($decoded['versions']) === 1) {
                    $matchedVersion = $decoded['versions'][0];
                } else {
                    // Get versions that match the Vin (need 1 style match, can use Series from VAuto -> Trim from JATO)
                    $matchedVersion = array_first($decoded['versions'], function ($version) use ($keyedData) {
                        return trim($version['trimName']) === trim($keyedData['Series']);
                    });
                }

                // if we couldn't match, try to use the Model Code
                if (! $matchedVersion) {
                    $matchedVersion = array_first($decoded['versions'], function ($version) use ($keyedData) {
                        return str_contains($version['modelCode'], $keyedData['Model Code']);
                    });
                }

                if (! $matchedVersion) {
                    Log::error('Could not find exact match for VIN -> JATO Version', [
                        'VAuto Row' => $keyedData,
                        'JATO VIN Decode' => $decoded,
                    ]);

                    continue;
                }

                /**
                 * Get the fully hydrated JATO matched version, either from our database or their API.
                 */
                DB::transaction(function () use ($matchedVersion, $versionDeal, $decoded, $keyedData, $fileHash) {
                    /**
                     * If we don't already have the jato info saved to a jato_vehicle_id then we need to save
                     * all of that (checking for manufacturer -> make -> model as well).
                     */
                    if (! $version = Version::where('jato_vehicle_id', $matchedVersion['vehicle_ID'])->first()) {
                        if (! $manufacturer = Manufacturer::where('name', $decoded['manufacturer'])->first()) {
                            // Save/Update manufacturer, make, model, then versions
                            $manufacturer = $this->saveManufacturer(
                                $this->client->manufacturerByName($decoded['manufacturer'])
                            );
                        }

                        if (! $make = Make::where('name', $decoded['make'])->first()) {
                            // Save/Update and save new make
                            $make = $this->saveManufacturerMake(
                                $manufacturer,
                                $this->client->makeByName($decoded['make'])
                            );
                        }

                        if (! $model = VehicleModel::where('name', $decoded['model'])->first()) {
                            // Save/Update and save new model
                            $model = $this->saveMakeModel(
                                $make,
                                $this->client->modelByName($decoded['model'])
                            );
                        }

                        $version = $this->saveModelVersion(
                            $model,
                            $this->client->modelsVersionsByVehicleId($matchedVersion['vehicle_ID'])
                        );
                    }

                    $versionDeal->versions()->attach($version->id);

                    $this->saveVersionFeatures(
                        $versionDeal
                    );

                    $this->saveVersionDealPhotos(
                        $versionDeal,
                        $keyedData['Photos']
                    );
                });
            } catch (ClientException | ServerException $e) {
                $this->info('Error: ' . $e->getMessage());
            } catch (QueryException $e) {
                $this->info('Error: ' . $e->getMessage());
            }
        }

        Deal::where('file_hash', '!=', $fileHash)->whereDoesntHave('purchases')->delete();
    }

    private function saveVersionFeaturesByGroup(Deal $deal, array $features, string $group)
    {
        collect($features)->each(function ($jatoFeature) use ($deal, $group) {
            /**
             * Only add features that have _content_ that starts with "Standard", "Optional", "Yes"
             * and does not have parenthesis in the _feature_
             */
            if ((! str_contains($jatoFeature['feature'], ['(', '/'])) && (
                    starts_with($jatoFeature['content'], 'Standard')
                    || starts_with($jatoFeature['content'], 'Yes')
                )) {
                try {
                    $feature = Feature::updateOrCreate([
                        'feature' => $jatoFeature['feature'],
                        'content' => $jatoFeature['content'],
                    ], [
                        'feature' => $jatoFeature['feature'],
                        'content' => $jatoFeature['content'],
                        'group' => $group,
                    ]);

                    $feature->deals()->save($deal);
                } catch (QueryException $e) {
                    // Already saved.
                }
            }
        });
    }

    private function saveVersionFeatures(Deal $deal)
    {
        $jatoVehicleId = $deal->versions->first()->jato_vehicle_id;

        $promises = [
            Feature::GROUP_SAFETY => $this->client->featuresByVehicleIdAndCategoryIdAsync($jatoVehicleId, 11),
            Feature::GROUP_SEATING => $this->client->featuresByVehicleIdAndCategoryIdAsync($jatoVehicleId, 9),
            Feature::COMFORT_AND_CONVENIENCE => $this->client->featuresByVehicleIdAndCategoryIdAsync($jatoVehicleId, 1),
            Feature::GROUP_TECHNOLOGY => $this->client->featuresByVehicleIdAndCategoryIdAsync($jatoVehicleId, 8),
        ];

        $results = unwrap($promises);

        foreach ($results as $group => $response) {
            /** @var Response $response */
            $this->saveVersionFeaturesByGroup(
                $deal,
                json_decode((string) $response->getBody(), true)['results'],
                $group
            );
        }
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
            'vauto_features' => $keyedData['Features'] !== '' ? $keyedData['Features'] : null,
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

        return $vehicleModel->versions()->create([
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
}
