<?php

namespace DeliverMyRide\VAuto;

use App\Feature;
use App\JatoFeature;
use App\JATO\Make;
use App\JATO\Manufacturer;
use App\JATO\VehicleModel;
use App\JATO\Version;
use App\Deal;
use Carbon\Carbon;
use DeliverMyRide\JATO\Client;
use Facades\App\JATO\Log;
use GuzzleHttp\Exception\ClientException;
use GuzzleHttp\Exception\ServerException;
use function GuzzleHttp\Promise\unwrap;
use GuzzleHttp\Psr7\Response;
use Illuminate\Database\QueryException;
use Illuminate\Filesystem\Filesystem;
use Illuminate\Support\Collection;
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
        "Option Codes",
    ];

    private const MAKE_BLACKLIST = [
        'smart',
    ];

    private $client;
    private $error;
    private $features;
    private $filesystem;
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

    public function setErrorFunction(callable $errorFunction)
    {
        $this->error = $errorFunction;
    }

    private function error(string $error)
    {
        if ($this->error) {
            call_user_func($this->error, $error);
        }
    }

    public function import()
    {
        $this->features = Feature::with('category')->get();

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
        $rowNumber = 2;

        while (($csvRow = fgetcsv($handle)) !== false) {
            $this->info("VAuto import row: #{$rowNumber}");
            $rowNumber++;

            $vAutoRow = array_combine(self::HEADERS, $csvRow);

            if ($vAutoRow['New/Used'] !== 'N') {
                $this->info("   Skipping Used Vehicle.");
                continue;
            }

            if (in_array($vAutoRow['Make'], self::MAKE_BLACKLIST)) {
                $this->info("   Skipping banned make: " . $vAutoRow['Make']);
                continue;
            }

            try {
                $deal = $this->saveOrUpdateDeal($fileHash, $vAutoRow);
                $decodedVin = $this->client->decodeVin($vAutoRow['VIN']);

                if (! $jatoVersion = $this->matchVersion($decodedVin, $vAutoRow)) {
                    Log::error('Could not find exact match for VIN -> JATO Version', [
                        'VAuto Row' => $vAutoRow,
                        'JATO VIN Decode' => $decodedVin,
                    ]);

                    continue;
                }

                DB::transaction(function () use ($jatoVersion, $deal, $decodedVin, $vAutoRow) {
                    // If this version is new (based on UUID-year), fill its version relations
                    if (! $version = Version::where('jato_uid', $jatoVersion['uid'])->where('year', $deal->year)->first()) {
                        $version = $this->saveVersionAndRelations($decodedVin, $jatoVersion);
                    }

                    $this->backfillNullMsrpsFromVersionMsrp($deal, $version);

                    // If the deal is new, then we need to attach it to its version and flesh out its relations from that version
                    if ($deal->wasRecentlyCreated) {
                        $this->info("   Saving new Deal");
                        $deal->versions()->attach($version->id);
                        $this->saveDealRelations($deal, $vAutoRow);
                    }

                    // If the version is new, we don't have to check for a possibly-updated JATO Vehicle ID
                    if ($version->wasRecentlyCreated) {
                        return true;
                    }

                    // Old version; but nothing has changed in this JATO Vehicle ID, so we can quit
                    if ($version->jato_vehicle_id == $jatoVersion['vehicle_ID']) {
                        $this->info("   Vehicle ID is unchanged.");
                        return true;
                    }

                    // JATO Vehicle ID has changed for this version; so we need to wipe and update all features for all related deals
                    $this->info("   JATO Vehicle ID has changed. Wiping features.");
                    $version->update(['jato_vehicle_id' => $jatoVersion['vehicle_ID']]);

                    foreach ($version->fresh()->deals as $attachedDeal) {
                        $this->wipeDealFeatures($attachedDeal);
                        $this->saveDealRelations($attachedDeal, $vAutoRow);
                    }
                });
            } catch (ClientException | ServerException $e) {
                Log::error('Importer error for vin [' . $vAutoRow['VIN']. ']: ' . $e->getMessage());
                $this->error('Error: ' . $e->getMessage());

                if ($e->getCode() === 401) {
                    $this->error('401 error connecting to JATO; cancelling the rest of the calls.');
                    throw $e;
                }
            } catch (QueryException $e) {
                Log::error('Importer error for vin [' . $vAutoRow['VIN']. ']: ' . $e->getMessage());
                $this->error('Error: ' . $e->getMessage());
            }
        }

        Deal::where('file_hash', '!=', $fileHash)->whereDoesntHave('purchases')->delete();
    }

    private function saveOrUpdateDeal(string $fileHash, array $vAutoRow) : Deal
    {
        $this->info("   Saving deal for vin: {$vAutoRow['VIN']}");

        $deal = Deal::updateOrCreate([
            'file_hash' => $fileHash,
            'vin' => $vAutoRow['VIN'],
        ], [
            'file_hash' => $fileHash,
            'dealer_id' => $vAutoRow['DealerId'],
            'stock_number' => $vAutoRow['Stock #'],
            'vin' => $vAutoRow['VIN'],
            'new' => $vAutoRow['New/Used'] === 'N',
            'year' => $vAutoRow['Year'],
            'make' => $vAutoRow['Make'],
            'model' => $vAutoRow['Model'],
            'model_code' => $vAutoRow['Model Code'],
            'body' => $vAutoRow['Body'],
            'transmission' => $vAutoRow['Transmission'],
            'series' => $vAutoRow['Series'],
            'series_detail' => $vAutoRow['Series Detail'],
            'door_count' => $vAutoRow['Door Count'],
            'odometer' => $vAutoRow['Odometer'],
            'engine' => $vAutoRow['Engine'],
            'fuel' => $vAutoRow['Fuel'],
            'color' => $vAutoRow['Colour'],
            'interior_color' => $vAutoRow['Interior Color'],
            'price' => $vAutoRow['Price'] !== '' ? $vAutoRow['Price'] : null,
            'msrp' => $vAutoRow['MSRP'] !== '' ? $vAutoRow['MSRP'] : null,
            'vauto_features' => $vAutoRow['Features'] !== '' ? $vAutoRow['Features'] : null,
            'inventory_date' => Carbon::createFromFormat('m/d/Y', $vAutoRow['Inventory Date']),
            'certified' => $vAutoRow['Certified'] === 'Yes',
            'description' => $vAutoRow['Description'],
            'option_codes' => array_filter(explode(',', $vAutoRow['Option Codes'])),
            'fuel_econ_city' => $vAutoRow['City MPG'] !== '' ? $vAutoRow['City MPG'] : null,
            'fuel_econ_hwy' => $vAutoRow['Highway MPG'] !== '' ? $vAutoRow['Highway MPG'] : null,
            'dealer_name' => $vAutoRow['Dealer Name'],
            'days_old' => $vAutoRow['Age'],
        ]);

        return $deal;
    }

    private function matchVersion($decodedVin, $vAutoRow)
    {
        // If there is just one version then use that
        if (count($decodedVin['versions']) === 1) {
            return $decodedVin['versions'][0];
        }

        // Get versions that match the Vin
        $jatoVersion = array_first($decodedVin['versions'], function ($version) use ($vAutoRow) {
            return trim($version['trimName']) === trim($vAutoRow['Series']);
        });

        if ($jatoVersion) {
            return $jatoVersion;
        }

        // if we couldn't match, try to use the Model Code; return null if none match
        return array_first($decodedVin['versions'], function ($version) use ($vAutoRow) {
            return str_contains($version['modelCode'], $vAutoRow['Model Code']) ||
                str_contains($version['localModelCode'], $vAutoRow['Model Code']);
        });
    }

    /**
     * Save the related data for a version--data that won't change if the JATO
     * vehicle ID changes
     */
    private function saveVersionAndRelations($decodedVin, $jatoVersion)
    {
        $this->info("   Saving version and relations for UID " . $jatoVersion['uid']);

        if (! $manufacturer = Manufacturer::where('name', $decodedVin['manufacturer'])->first()) {
            // Save/Update manufacturer, make, model, then versions
            $manufacturer = $this->saveManufacturer(
                $this->client->manufacturerByName($decodedVin['manufacturer'])
            );
        }

        if (! $make = Make::where('name', $decodedVin['make'])->first()) {
            // Save/Update and save new make
            $make = $this->saveManufacturerMake(
                $manufacturer,
                $this->client->makeByName($decodedVin['make'])
            );
        }

        if (! $model = VehicleModel::where('name', $decodedVin['model'])->first()) {
            // Save/Update and save new model
            $model = $this->saveMakeModel(
                $make,
                $this->client->modelByName($jatoVersion['urlModelName'])
            );
        }

        return $this->saveModelVersion(
            $model,
            $this->client->modelsVersionsByVehicleId($jatoVersion['vehicle_ID'])
        );
    }

    private function wipeDealFeatures($deal)
    {
        $deal->features()->sync([]);
        $deal->jatoFeatures()->sync([]);
    }

    private function saveDealRelations($deal, $vAutoRow)
    {
        $this->saveDealJatoFeatures($deal);
        $this->saveDealPhotos($deal, $vAutoRow['Photos']);

        $importer = new DealFeatureImporter($deal, $this->features, $this->client);
        $importer->import();
    }

    private function saveDealJatoFeatures(Deal $deal)
    {
        $jatoVehicleId = $deal->versions->first()->jato_vehicle_id;

        $promises = collect(JatoFeature::SYNC_GROUPS)->flatMap(function ($group) use ($jatoVehicleId) {
            return [$group['title'] => $this->client->featuresByVehicleIdAndCategoryIdAsync($jatoVehicleId, $group['id'])];
        });

        $results = unwrap($promises);

        foreach ($results as $group => $response) {
            /** @var Response $response */
            $this->saveDealJatoFeaturesByGroup(
                $deal,
                json_decode((string) $response->getBody(), true)['results'],
                $group
            );
        }

        $this->saveCustomHackyJatoFeatures($deal);
    }

    private function saveDealJatoFeaturesByGroup(Deal $deal, array $features, string $group)
    {
        collect($features)->reduce(function (Collection $carry, $jatoFeature) {
            return $carry->merge(self::splitJATOFeaturesAndContent($jatoFeature['feature'], $jatoFeature['content']));
        }, collect())->each(function ($featureAndContent) use ($deal, $group) {
            /**
             * Only interior features that contain "seat" should be added to seating
             */
            if ($group === JatoFeature::GROUP_SEATING_KEY && !str_contains($featureAndContent['feature'], 'seat')) {
                return;
            }

            /**
             * Only add features that have _content_ that starts with "Standard", "Optional", "Yes".
             */
            if (starts_with($featureAndContent['content'], ['Standard', 'Yes'])) {
                try {
                    $feature = JatoFeature::updateOrCreate([
                        'feature' => $featureAndContent['feature'],
                        'content' => $featureAndContent['content'],
                    ], [
                        'feature' => $featureAndContent['feature'],
                        'content' => $featureAndContent['content'],
                        'group' => $this->getGroupWithOverrides($featureAndContent['feature'], $group),
                    ]);

                    $feature->deals()->save($deal);
                } catch (QueryException $e) {
                    // Already saved.
                }
            }
        });
    }

    private function getGroupWithOverrides(string $feature, string $group)
    {
        /** If group contains "seat" then it should be in "seating" category */
        return str_contains($feature, 'seat') ? JatoFeature::GROUP_SEATING_KEY : $group;
    }

    private function saveCustomHackyJatoFeatures(Deal $deal)
    {
        $jatoVersion = $deal->versions->first();

        if ($jatoVersion->body_style === 'Pickup') {
            try {
                $doorCount = JatoFeature::updateOrCreate([
                    'feature' => "$deal->door_count Door",
                    'content' => $deal->door_count,
                ], [
                    'feature' => "$deal->door_count Door",
                    'content' => $deal->door_count,
                    'group' => JatoFeature::GROUP_TRUCK_KEY,
                ]);

                $cabType = JatoFeature::updateOrCreate([
                    'feature' => "$jatoVersion->cab Cab",
                    'content' => $jatoVersion->cab,
                ], [
                    'feature' => "$jatoVersion->cab Cab",
                    'content' => $jatoVersion->cab,
                    'group' => JatoFeature::GROUP_TRUCK_KEY,
                ]);

                $doorCount->deals()->save($deal);
                $cabType->deals()->save($deal);
            } catch (QueryException $e) {
                // Already Saved.
            }
        }
    }

    private function saveDealPhotos(Deal $deal, string $photos)
    {
        collect(explode('|', $photos))->each(function ($photoUrl) use ($deal) {
            $deal->photos()->firstOrCreate(['url' => str_replace('http', 'https', $photoUrl)]);
        });
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
        $this->info('   Saving Model Version: ' . $version['vehicleId']);

        return $vehicleModel->versions()->create([
            'jato_vehicle_id' => $version['vehicleId'],
            'jato_uid' => $version['uid'],
            'jato_model_id' => $version['modelId'],
            'year' => str_before($version['modelYear'], '.'), // trim off .5
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
            'cab' => $version['cabType'] !== '' ? $version['cabType'] : null,
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

    private function backfillNullMsrpsFromVersionMsrp($deal, $version)
    {
        if (! $deal->msrp && $version['msrp']) {
            $deal->update(['msrp' => $version['msrp']]);
        }
    }

    private function saveManufacturer(array $manufacturer)
    {
        $this->info('   Saving Manufacturer: ' . $manufacturer['manufacturerName']);

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
        $this->info('   Saving Manufacturer Make: ' . $make['makeName']);

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
        $this->info('   Saving Make Model: ' . $model['modelName']);

        return $make->models()->updateOrCreate([
            'url_name' => $model['urlModelName'],
        ], [
            'name' => $model['modelName'],
            'url_name' => $model['urlModelName'],
            'is_current' => $model['isCurrent'],
        ]);
    }

    public static function splitJATOFeaturesAndContent($feature, $content)
    {
        $all = [];

        if (str_contains($feature, '(')) {
            [$prefix, $suffix] = array_map('trim', explode('(', $feature));

            if (str_contains($suffix, ' / ')) {
                $features = array_map(function ($str) {
                    return trim($str, '() ');
                }, explode(' / ', $suffix));

                $contents = array_map('trim', explode(' / ', $content));

                foreach ($features as $index => $thisfeature) {
                    $all[] = [
                        'feature' => "$prefix $thisfeature",
                        // If there's only one content value for more than one features, grab the first on fail
                        'content' => array_get($contents, $index, reset($contents)),
                    ];
                }
            } else {
                $features = [$prefix, $prefix . ' ' . trim($suffix, '() ')];
                $contents = array_map(function ($str) {
                    return trim($str, ') ') ;
                }, explode('(', $content));

                if (count($features) != count($contents)) {
                    Log::info("Cannot parse feature: title[$feature] content[$content]");
                    return $all;
                }

                foreach ($features as $index => $feature) {
                    $all[] = [
                        'feature' => $feature,
                        'content' => $contents[$index],
                    ];
                }
            }

            return $all;
        } elseif (str_contains($feature, ' / ')) {
            $features = array_map('trim', explode(' / ', $feature));
            $contents = array_map('trim', explode(' / ', $content));

            foreach ($features as $index => $feature) {
                $all[] = [
                    'feature' => $feature,
                    'content' => $contents[$index],
                ];
            }
        } else {
            $all = [
                [
                    'feature' => trim($feature),
                    'content' => trim($content),
                ],
            ];
        }

        return $all;
    }
}
