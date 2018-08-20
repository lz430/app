<?php

namespace DeliverMyRide\VAuto;

use App\Models\Dealer;
use App\Models\JATO\Version;
use App\Models\Deal;

use DeliverMyRide\Fuel\FuelClient;
use DeliverMyRide\JATO\JatoClient;
use DeliverMyRide\RIS\RISClient;
use DeliverMyRide\VAuto\Deal\DealMunger;

use Carbon\Carbon;
use Exception;
use Illuminate\Support\Facades\Log;
use GuzzleHttp\Exception\ClientException;
use GuzzleHttp\Exception\ServerException;
use Illuminate\Database\QueryException;
use Illuminate\Filesystem\Filesystem;
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

    private const PROCESS_BATCH_SIZE = 100;

    private $jatoClient;
    private $fuelClient;
    private $risClient;

    private $error;
    private $filesystem;
    private $info;
    private $debug;

    public function __construct(Filesystem $filesystem,
                                JatoClient $jatoClient,
                                FuelClient $fuelClient,
                                RISClient $risClient)
    {
        $this->filesystem = $filesystem;
        $this->jatoClient = $jatoClient;
        $this->fuelClient = $fuelClient;
        $this->risClient = $risClient;


        $this->debug = [
            'start' => microtime(true),
            'created' => 0,
            'updated' => 0,
            'skipped' => 0,
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
    private function buildSourceData(): array
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
                return !$this->skipSourceRecord($row);
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

        foreach ($batch as $row) {
            $this->processRecord($row);
        }
    }

    /**
     * @param array $row
     * @throws \GuzzleHttp\Exception\GuzzleException
     */
    private function processRecord(array $row)
    {
        try {
            list($version, $versionDebugData) = (new VersionMunger($row, $this->jatoClient, $this->fuelClient, $this->risClient))->build();
            $this->info("Deal: {$row['VIN']} - {$row['Stock #']}");

            //
            // Fail if we don't have a version
            if (!$version) {
                Log::channel('jato')->error('Could not find exact match for VIN -> JATO Version', [
                    'VAuto Row' => $row,
                ]);
                $this->info("    -- Error: Could not find match for vin");
                return;
            }

            $deal = $this->saveOrUpdateDeal($version, $row['file_hash'], $row);

            if ($deal->wasRecentlyCreated) {
                $this->debug['created']++;
            } else {
                $this->debug['updated']++;
            }

            $this->info("    -- Version Options: {$versionDebugData['possible_versions']}");

            if (isset($versionDebugData['name_search_term'])) {
                $this->info("    -- Version Matching: {$versionDebugData['name_search_term']} | {$versionDebugData['name_search_name']} | {$versionDebugData['name_search_score']} ");
            }

            $this->info("    -- Version ID: {$version->id}");
            $this->info("    -- Deal ID: {$deal->id}");
            $this->info("    -- Deal Title: {$deal->title()}");
            $this->info("    -- Is New: " . ($deal->wasRecentlyCreated ? "Yes" : "No"));

            DB::transaction(function () use ($deal, $row) {
                $debug = (new DealMunger($deal, $this->jatoClient, $this->fuelClient, $row))->import();

                // Equipment
                $this->info("    -- Equipment: Skipped?: {$debug['equipment_skipped']}");

                if (count($debug['equipment_extracted_codes'])) {
                    $codes = collect($debug['equipment_extracted_codes'])->pluck('Option Code')->all();
                    $msg = implode(", ", $codes);
                    $this->info("    -- Equipment: Extracted Option Codes: {$msg}");
                }

                // Features
                $this->info("    -- Features: Skipped?: {$debug['feature_skipped']}");
                $this->info("    -- Features: New Jato Features: {$debug['feature_count']}");

                // Photos
                $this->info("    -- Photos: Skipped?: {$debug['deal_photos_skipped']}");
                $this->info("    -- Photos: Deal Photos: {$debug['deal_photos']}");
                $this->info("    -- Photos: Stock Photos: {$debug['stock_photos']}");

            });

        } catch (ClientException | ServerException $e) {
            Log::channel('jato')->error('Importer error for vin [' . $row['VIN'] . ']: ' . $e->getMessage());
            $this->error('Error: ' . $e->getMessage());
            app('sentry')->captureException($e);
            if ($e->getCode() === 401) {
                $this->error('401 error connecting to JATO; cancelling the rest of the calls.');
                throw $e;
            }
        } catch (QueryException | Exception $e) {
            Log::channel('jato')->error('Importer error for vin [' . $row['VIN'] . ']: ' . $e->getMessage());
            $this->error('Error: ' . $e->getMessage());
            app('sentry')->captureException($e);
        }
    }

    /**
     *
     * @param $row
     * @return bool returns true if we should skip the row.
     */
    private function skipSourceRecord(array $row): bool
    {
        $skip = false;

        if ($row['New/Used'] !== 'N') {
            $skip = true;
        }

        if (in_array($row['Make'], Map::IMPORT_MAKE_BLACKLIST)) {
            $skip = true;
        }

        if (strlen($row['Price']) > 6) {
            $skip = true;
        }

        if (is_null($row['Price'])) {
            $skip = true;
        }

        $dealer = Dealer::where('dealer_id', $row['DealerId'])->get()->first();
        if (!$dealer) {
            $skip = true;
        }

        if ($skip) {
            $this->debug['skipped']++;
        }

        return $skip;
    }

    /**
     * @throws \GuzzleHttp\Exception\GuzzleException
     */
    public function import()
    {
        $sources = $this->buildSourceData();
        $hashes = [];
        foreach ($sources as $source) {
            $this->parseSourceData($source);
            $hashes[] = $source['hash'];
        }

        $this->info("RESULTS ::::");

        $this->info(" -- Created Deals: " . $this->debug['created']);
        $this->info(" -- Updated Deals: " . $this->debug['updated']);
        $this->info(" -- Skipped Deals: " . $this->debug['skipped']);

        //
        // Delete all the hashes
        $this->info(" -- Records to remove from es: " . Deal::whereNotIn('file_hash', $hashes)->count());
        $this->info(" -- Records to delete from db: " . Deal::whereNotIn('file_hash', $hashes)->whereDoesntHave('purchases')->count());

        Deal::whereNotIn('file_hash', $hashes)->unsearchable();
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

        // Remove utf8 chars.
        if ($row['Features']) {
            $vauto_features = preg_replace('/[^\x01-\x7F]/', '', $row['Features']);
        } else {
            $vauto_features = null;
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
            'msrp' => isset($pricing->msrp) ? $pricing->msrp : null,
            'vauto_features' => $vauto_features,
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
}
