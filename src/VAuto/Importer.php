<?php

namespace DeliverMyRide\VAuto;

use App\Models\Feature;
use App\Models\JatoFeature;
use App\Models\JATO\Make;
use App\Models\JATO\Manufacturer;
use App\Models\JATO\VehicleModel;
use App\Models\JATO\Version;
use App\Models\Deal;
use Carbon\Carbon;
use DeliverMyRide\JATO\JatoClient;
use Exception;
use Illuminate\Support\Facades\Log;
use GuzzleHttp\Exception\ClientException;
use GuzzleHttp\Exception\ServerException;
use Illuminate\Database\QueryException;
use Illuminate\Filesystem\Filesystem;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;

use League\Csv\Reader;
use League\Csv\Statement;

/**
 *
 */
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
        "Invoice",
        "Sticker",
        "Dealer Discounted",
        "MEMOLINE1",
        "MEMOLINE2",
        "FLOORPLANAMOUNT",
        "SALESCOST",
        "INVOICEAMOUNT",

    ];

    private const MAKE_BLACKLIST = [
        'smart',
    ];

    private const PROCESS_BATCH_SIZE = 100;

    private $client;
    private $error;
    private $features;
    private $filesystem;
    private $info;
    private $debug;

    public function __construct(Filesystem $filesystem, JatoClient $client)
    {
        $this->filesystem = $filesystem;
        $this->client = $client;
        $this->debug = [
            'start' => microtime(true),
        ];
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

    /**
     * @return array
     */
    private function buildSourceData() : array
    {
        $sources = [];

        $files = array_filter(
            $this->filesystem->files(realpath(base_path(config('services.vauto.uploads_path')))),
            function ($file) {
                return pathinfo($file, PATHINFO_EXTENSION) === 'csv';
            }
        );

        foreach ($files as $path) {
            $sources[] = [
                'path' => $path,
                'hash' => md5_file($path),
            ];
        }

        return $sources;
    }

    /**
     * @param array $source
     * @throws \GuzzleHttp\Exception\GuzzleException
     */
    private function parseSourceData(array $source)
    {

        $reader = Reader::createFromPath($source['path'], 'r');

        $stmt = (new Statement())
            ->where(function ($row) {
                return $this->skipSourceRecord($row);
            });

        $records = $stmt->process($reader, self::HEADERS);

        $batch = [];
        foreach ($records as $record) {
            $record['file_hash'] = $source['hash'];
            $batch[] = $record;

            if (count($batch) >= self::PROCESS_BATCH_SIZE) {
                $this->processBatchOfRecords($batch);
                $batch = [];
            }
        }

        // Leftovers
        if (count($batch)) {
            $this->processBatchOfRecords($batch);
        }

    }

    /**
     * @param array $batch
     * @throws \GuzzleHttp\Exception\GuzzleException
     */
    private function processBatchOfRecords(array $batch)
    {
        $vins = [];
        foreach ($batch as $row) {
            $vins[] = $row['VIN'];
        }

        $decodedData = $this->decodeVins($vins);

        foreach ($batch as $row) {
            if (isset($decodedData[$row['VIN']])) {
                $row = $this->transformRecord($row);
                $this->processRecord($row, $decodedData[$row['VIN']]);
            }
        }
    }

    /**
     * @param array $row
     * @return array
     */
    private function transformRecord(array $row) : array
    {

        // Option Codes
        $optionCodes = array_filter(array_map('trim', explode(",", $row['Option Codes'])));

        $rules = [
            "/(?<=(?i)Quick Order Package )(.*?)(?=\|| )/",
        ];

        foreach($rules as $rule) {
            $matches = [];
            preg_match($rule, $row['Features'], $matches);
            if (count($matches)) {
                $optionCodes += $matches;
            }
        }

        $optionCodes =  array_unique($optionCodes);

        $row['Option Codes'] = implode(",", $optionCodes);
        return $row;
    }


    /**
     * @param array $row
     * @param \stdClass $decodedVin
     * @throws \GuzzleHttp\Exception\GuzzleException
     */
    private function processRecord(array $row, \stdClass $decodedVin)
    {
        try {
            list($version, $shouldRefreshDeals, $versionDebugData) = (new VersionMunger($row, $decodedVin, $this->client))->build();

            $this->info("Deal: {$row['VIN']} - {$row['Stock #']}");

            //
            // Fail if we don't have a version
            if (!$version) {
                Log::channel('jato')->error('Could not find exact match for VIN -> JATO Version', [
                    'VAuto Row' => $row,
                    'JATO VIN Decode' => $decodedVin,
                ]);
                return;
            }

            $deal = $this->saveOrUpdateDeal($version, $row['file_hash'], $row);

            $this->info("    -- Version Options: {$versionDebugData['possible_versions']}");
            if (isset($versionDebugData['name_search_term'])) {
                $this->info("    -- Version Matching: {$versionDebugData['name_search_term']} | {$versionDebugData['name_search_name']} | {$versionDebugData['name_search_score']} ");
            }
            $this->info("    -- Version ID: {$version->id}");
            $this->info("    -- Deal ID: {$deal->id}");
            $this->info("    -- Is New: " . ($deal->wasRecentlyCreated ? "Yes" : "No"));

            DB::transaction(function () use ($version, $shouldRefreshDeals, $deal, $decodedVin, $row) {

                if ($deal->wasRecentlyCreated) {
                    $this->saveDealRelations($deal, $row);
                }

                // Refresh existing deals if version has changed
                if ($shouldRefreshDeals) {
                    foreach ($version->fresh()->deals as $attachedDeal) {
                        $this->wipeDealFeatures($attachedDeal);
                        $this->saveDealRelations($attachedDeal, $row);
                    }
                }

            });
        } catch (ClientException | ServerException $e) {
            Log::channel('jato')->error('Importer error for vin [' . $row['VIN'] . ']: ' . $e->getMessage());
            $this->error('Error: ' . $e->getMessage());

            if ($e->getCode() === 401) {
                $this->error('401 error connecting to JATO; cancelling the rest of the calls.');
                throw $e;
            }
        } catch (QueryException | Exception $e) {
            Log::channel('jato')->error('Importer error for vin [' . $row['VIN'] . ']: ' . $e->getMessage());
            $this->error('Error: ' . $e->getMessage());
        }
    }
    /**
     * @param array $vins
     * @return array
     * @throws \GuzzleHttp\Exception\GuzzleException
     */
    private function decodeVins(array $vins): array
    {
        $start = microtime(true);
        $decodedVinData = [];
        try {
            $decodedVinData = $this->client->vin->decodeBulk($vins);
        } catch (ClientException $e) {
            // If we get back a 404 it means one or more of the vins
            // were invalid.
            if ($e->getCode() == '404') {
                $body = $e->getResponse()->getBody()->getContents();
                preg_match('/\'([^"]+)\'/', $body, $m);
                $m = end($m);
                if (array_search($m, $vins) !== FALSE) {
                    unset($vins[array_search($m, $vins)]);
                    $this->decodeVins($vins);
                } else {
                    // something probably failed to extract the vin info
                    return [];
                }
            } else {
                return [];
            }
        }

        $data = [];
        foreach ($decodedVinData as $vehicle) {
            $data[$vehicle->vin] = $vehicle;
        }

        $stop = microtime(true);
        $time = $stop - $start;
        $this->info("decodeVins: {$time}");
        return $data;
    }

    /**
     *
     * @param $row
     * @return bool returns true if we should skip the row.
     */
    private function skipSourceRecord(array $row): bool
    {
        if ($row['New/Used'] !== 'N') {
            //$this->info("   Skipping Used Vehicle.");
            return false;
        }

        if (in_array($row['Make'], self::MAKE_BLACKLIST)) {
            //$this->info("   Skipping banned make: " . $row['Make']);
            return false;
        }

        if (strlen($row['Price']) > 6) {
            //$this->info("   Skipping high price: " . $row['Price']);
            return false;
        }

        if (is_null($row['Price'])) {
            // $this->info("   Skipping no price");
            return false;
        }

        return true;
    }

    /**
     *
     */
    public function import()
    {
        $this->features = Feature::with('category')->get();


        $sources = $this->buildSourceData();
        $hashes = [];
        foreach ($sources as $source) {
            $this->parseSourceData($source);
            $hashes[] = $source['hash'];
        }

        //
        // Delete all the hashes
        Deal::whereNotIn('file_hash', $hashes)->whereDoesntHave('purchases')->delete();

        $this->debug['stop'] = microtime(true);
        $time = $this->debug['stop'] - $this->debug['start'];
        $this->info("Execution Time: {$time}");
    }


    /**
     * @param array $row
     * @return \stdClass
     */
    private function getDealSourcePrice($row)
    {

        /**
         * key: internal value
         * value: vauto row header
         */
        $map = [
            'msrp' => "MSRP",
            'price' => "Price",
            'invoice' => "Invoice",
            'sticker' => "Sticker",
            'dealerdiscounted' => "Dealer Discounted",
            'memoline1' => "MEMOLINE1",
            'memoline2' => "MEMOLINE2",
            'floorplanamount' => "FLOORPLANAMOUNT",
            'salescost' => "SALESCOST",
            'invoiceamount' => "INVOICEAMOUNT",
        ];

        $return = [];

        foreach ($map as $key => $value) {
            if ($row[$value]) {
                $return[$key] = trim($row[$value]);
            }
        }



        return (object)$return;
    }

    /**
     * @param Version $version
     * @param string $fileHash
     * @param array $row
     * @return Deal
     */
    private function saveOrUpdateDeal(Version $version, string $fileHash, array $row): Deal
    {

        $pricing = $this->getDealSourcePrice($row);
        if (!isset($pricing->msrp) && $version->msrp) {
            $pricing->msrp = $version->msrp;
        }



        $deal = Deal::updateOrCreate([
            'vin' => $row['VIN'],
        ], [
            'file_hash' => $fileHash,
            'dealer_id' => $row['DealerId'],
            'stock_number' => $row['Stock #'],
            'vin' => $row['VIN'],
            'new' => $row['New/Used'] === 'N',
            'year' => $row['Year'],
            'make' => $row['Make'],
            'model' => $row['Model'],
            'model_code' => $row['Model Code'],
            'body' => $row['Body'],
            'transmission' => $row['Transmission'],
            'series' => $row['Series'],
            'series_detail' => $row['Series Detail'],
            'door_count' => $row['Door Count'],
            'odometer' => $row['Odometer'],
            'engine' => $row['Engine'],
            'fuel' => $row['Fuel'],
            'color' => $row['Colour'],
            'interior_color' => $row['Interior Color'],
            'price' => isset($pricing->price) ? $pricing->price : null,
            'msrp' => isset($pricing->msrp) ? $pricing->msrp: null,
            'vauto_features' => $row['Features'] !== '' ? $row['Features'] : null,
            'inventory_date' => Carbon::createFromFormat('m/d/Y', $row['Inventory Date']),
            'certified' => $row['Certified'] === 'Yes',
            'description' => $row['Description'],
            'option_codes' => array_filter(explode(',', $row['Option Codes'])),
            'fuel_econ_city' => $row['City MPG'] !== '' ? $row['City MPG'] : null,
            'fuel_econ_hwy' => $row['Highway MPG'] !== '' ? $row['Highway MPG'] : null,
            'dealer_name' => $row['Dealer Name'],
            'days_old' => $row['Age'],
            'version_id' => $version->id,
            'source_price' => $pricing,
        ]);

        return $deal;
    }

    /**
     * @param $deal
     */
    private function wipeDealFeatures(Deal $deal)
    {
        $deal->features()->sync([]);
        $deal->jatoFeatures()->sync([]);
    }

    private function saveDealRelations(Deal $deal, $row)
    {
        $this->saveDealJatoFeatures($deal);
        $this->saveDealPhotos($deal, $row['Photos']);
        (new DealFeatureImporter($deal, $this->features, $this->client))->import();
    }


    private function getCategorizedFeaturesByVehicleId(string $vehicleId)
    {

        $response = $this->client->feature->get($vehicleId, '', 1, 400, false);

        $data = [];

        foreach ($response->results as $feature) {
            if (!isset($data[$feature->categoryId])) {
                $data[$feature->categoryId] = [];
            }
            $data[$feature->categoryId][] = $feature;
        }

        return $data;
    }

    private function saveDealJatoFeatures(Deal $deal)
    {

        $jatoVehicleId = $deal->version->jato_vehicle_id;
        $features = $this->getCategorizedFeaturesByVehicleId($jatoVehicleId);

        foreach (JatoFeature::SYNC_GROUPS as $group) {
            if (isset($features[$group['id']])) {
                $this->saveDealJatoFeaturesByGroup($deal, $features[$group['id']], $group['title']);
            }
        }

        $this->saveCustomHackyJatoFeatures($deal);
    }

    private function saveDealJatoFeaturesByGroup(Deal $deal, array $features, string $group)
    {
        collect($features)->reduce(function (Collection $carry, $jatoFeature) {
            return $carry->merge(self::splitJATOFeaturesAndContent($jatoFeature->feature, $jatoFeature->content));
        }, collect())->each(function ($featureAndContent) use ($deal, $group) {
            /**
             * Only interior features that contain "seat" should be added to seating
             */
            if ($group === JatoFeature::GROUP_SEATING_KEY && !str_contains($featureAndContent['feature'], 'seat')) {
                return;
            }

            /**
             * Only add features that have _content_ that starts with "Standard", "Yes".
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
        $jatoVersion = $deal->version;

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
        collect(explode('|', $photos))
            ->reject(function ($photoUrl) {
                return $photoUrl == '';
            })
            ->each(function ($photoUrl) use ($deal) {
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

    /**
     * @param Deal $deal
     * @param $version
     */
    private function backfillNullMsrpsFromVersionMsrp(Deal $deal, $version)
    {

        if (!$deal->msrp && $version->msrp) {
            $deal->update(['msrp' => $version->msrp]);
        }
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
                    return trim($str, ') ');
                }, explode('(', $content));

                if (count($features) != count($contents)) {
                    Log::channel('jato')->debug("Cannot parse feature: title[$feature] content[$content]");
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
