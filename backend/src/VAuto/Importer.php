<?php

namespace DeliverMyRide\VAuto;

use App\Models\Dealer;
use App\Models\JATO\Version;
use App\Models\Deal;

use DeliverMyRide\JATO\JatoClient;

use Carbon\Carbon;
use Exception;
use Illuminate\Support\Facades\Log;
use GuzzleHttp\Exception\ClientException;
use GuzzleHttp\Exception\ServerException;
use Illuminate\Database\QueryException;
use Illuminate\Filesystem\Filesystem;
use Illuminate\Support\Facades\DB;

use Illuminate\Support\Facades\File;

use League\Csv\Reader;
use League\Csv\Statement;

use Illuminate\Support\Facades\Notification;
use App\Notifications\NotifyToSlackChannel;


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

    private $error;
    private $filesystem;
    private $info;
    private $debug;

    public function __construct(Filesystem $filesystem,
                                JatoClient $jatoClient)
    {
        $this->filesystem = $filesystem;
        $this->jatoClient = $jatoClient;

        $this->debug = [
            'start' => microtime(true),
            'dealsCreated' => 0,
            'dealsUpdated' => 0,
            'skipped' => 0,
            'erroredVins' => 0,
            'erroredMisc' => 0,
            'versionsCreated' => 0,
            'versionsUpdated' => 0,
            'versionPhotosUpdated' => 0,
            'dealPhotosRefreshed' => 0,
            'dealStockPhotos' => 0,
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
            list($version, $versionDebugData) = (new VersionMunger($this->jatoClient))->build($row);
            $this->info("Deal: {$row['VIN']} - {$row['Stock #']}");

            if(isset($versionDebugData['versionPhotos'])) {
                $this->debug['versionPhotosUpdated'] = $versionDebugData['versionPhotos'];
            }

            //
            // Fail if we don't have a version
            if (!$version) {
                Log::channel('jato')->error('Could not find exact match for VIN -> JATO Version', [
                    'VAuto Row' => $row,
                ]);
                $this->debug['erroredVins']++;
                $this->info("    -- Error: Could not find match for vin");
                return;
            }
            if(isset($versionDebugData['versionsCreated'])) {
                $this->debug['versionsCreated'] = $versionDebugData['versionsCreated'];
            }
            if(isset($versionDebugData['versionsUpdated'])) {
                $this->debug['versionsUpdated'] = $versionDebugData['versionsUpdated'];
            }

            $deal = $this->saveOrUpdateDeal($version, $row['file_hash'], $row);

            if ($deal->wasRecentlyCreated) {
                $this->debug['dealsCreated']++;
            } else {
                $this->debug['dealsUpdated']++;
            }

            $this->info("    -- Version Options: {$versionDebugData['possible_versions']}");

            if (isset($versionDebugData['name_search_term'])) {
                $this->info("    -- Version Matching: {$versionDebugData['name_search_term']} | {$versionDebugData['name_search_name']} | {$versionDebugData['name_search_score']} ");
            }

            $this->info("    -- Version ID: {$version->id}");
            $this->info("    -- Deal ID: {$deal->id}");
            $this->info("    -- Deal Title: {$deal->title()}");
            $this->info("    -- Is New: " . ($deal->wasRecentlyCreated ? "Yes" : "No"));
            $dealMunger = resolve('DeliverMyRide\VAuto\Deal\DealMunger');
            DB::transaction(function () use ($dealMunger, $deal, $row) {
                $debug = $dealMunger->import($deal, $row);

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
                $this->info("    -- Photos: Refreshed?: {$debug['deal_photos_refreshed']}");
                $this->info("    -- Photos: Deal Photos: {$debug['deal_photos']}");
                $this->info("    -- Photos: Stock Photos: {$debug['stock_photos']}");

                if($debug['deal_photos_refreshed'] == "Yes") {
                    $this->debug['dealPhotosRefreshed']++;
                }

                if($debug['stock_photos'] > 0) {
                    $this->debug['dealStockPhotos']++;
                }

            });

        } catch (ClientException | ServerException $e) {
            Log::channel('jato')->error('Importer error for vin [' . $row['VIN'] . ']: ' . $e->getMessage());
            $this->error('Error: ' . $e->getMessage());
            app('sentry')->captureException($e);
            $querySetErrorStatus = Deal::where('vin', $row['VIN']);
            $querySetErrorStatus->update(['status' => 'error']);
            $this->debug['erroredMisc']++;
            if ($e->getCode() === 401) {
                $this->error('401 error connecting to JATO; cancelling the rest of the calls.');
                throw $e;
            }
        } catch (QueryException | Exception $e) {
            Log::channel('jato')->error('Importer error for vin [' . $row['VIN'] . ']: ' . $e->getMessage());
            $this->error('Error: ' . $e->getMessage());
            app('sentry')->captureException($e);
            $querySetErrorStatus = Deal::where('vin', $row['VIN']);
            $querySetErrorStatus->update(['status' => 'error']);
            $this->debug['erroredMisc']++;
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

        $dealer = Dealer::where('dealer_id', $row['DealerId'])->first();
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

        $this->info(" -- Created Deals: " . $this->debug['dealsCreated']);
        $this->info(" -- Updated Deals: " . $this->debug['dealsUpdated']);
        $this->info(" -- Skipped Deals: " . $this->debug['skipped']);

        $queryToDelete = Deal::whereRaw('created_at <= DATE_SUB(NOW(), INTERVAL 6 MONTH)')->whereDoesntHave('purchases');
        $queryUpdateSold = Deal::whereNotIn('file_hash', $hashes)->where('status', '=', 'available');

        //
        // Delete all the hashes
        $this->info(" -- Records to remove from es: " . $queryUpdateSold->count());
        $this->info(" -- Records to delete from db: " . $queryToDelete->count());

        // Sets status of deals that are not in feed to sold
        $queryUpdateSold->update(['status' => 'sold', 'sold_at' => Carbon::now()]);
        $queryUpdateSold->searchable();

        //Finds and deletes deals with no purchases after 6 months
        $queryToDelete->unsearchable();
        $queryToDelete->delete();

        $this->debug['stop'] = microtime(true);
        $time = $this->debug['stop'] - $this->debug['start'];
        $this->info("Execution Time: {$time}");

        // Variables and logic for sending import slack notifications of import start
        $importEnd = date('m/d/Y g:ia');
        $data = [
            'title' => 'vAuto Importer',
            'message' => "Import Finished - {$importEnd}",
            'fields' => [
                'Import File Created' => date("F d Y g:ia", filemtime($source['path'])),
                'Environment' => config('app.env'),
                'Deals Created' => $this->debug['dealsCreated'],
                'Deals Updated' => $this->debug['dealsUpdated'],
                'Deal Photos Refreshed' => $this->debug['dealPhotosRefreshed'],
                'Deal Stock Photos Found' => $this->debug['dealStockPhotos'],
                'Deals Skipped' => $this->debug['skipped'],
                'Deals Set to Sold' => $queryUpdateSold->count(),
                'Versions Created' => $this->debug['versionsCreated'],
                'Versions Updated' => $this->debug['versionsUpdated'],
                'Version Photos Updated' => $this->debug['versionPhotosUpdated'],
                'Deal Errors No VINS' => $this->debug['erroredVins'],
                'Misc Errors' => $this->debug['erroredMisc'],
                'Total Execution Time' => $this->formatTimePeriod($this->debug['stop'], $this->debug['start']),
            ]
        ];
        Notification::route('slack', config('services.slack.webhook'))
            ->notify(new NotifyToSlackChannel($data));

        //Copies vauto dump file for current day and saves per date for archives
        $Path = storage_path() . '/app/public/importbackups';

        if (!file_exists($Path)) {
            File::makeDirectory($Path);
        }
        $baseFile = basename($source['path'], '.csv');
        $sourceFile = $source['path'];
        $targetFile = $Path . '/' . $baseFile . '-' . date('m-d-Y') . '.csv';
        File::copy($sourceFile, $targetFile);
    }

    /**
     * @param $endTime
     * @param $startTime
     * @return string
     */
    private function formatTimePeriod($endTime, $startTime)
    {
        $duration = $endTime - $startTime;
        $hours = (int) ($duration / 60 / 60);
        $minutes = (int) ($duration / 60) - $hours * 60;
        $seconds = (int) $duration - $hours * 60 * 60 - $minutes * 60;
        return ($hours == 0 ? "00":$hours) . " Hours " . ($minutes == 0 ? "00":($minutes < 10? "0".$minutes:$minutes)) . " Minutes " . ($seconds == 0 ? "00":($seconds < 10? "0".$seconds:$seconds)) . " Seconds ";
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

        /* @var Deal $deal */
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
            'msrp' => (isset($pricing->msrp) && (strlen($pricing->msrp) <= 6)) ? $pricing->msrp : ((strlen($pricing->msrp) > 6) ? substr($pricing->msrp, 0, 6) : null),
            'vauto_features' => $vauto_features,
            'inventory_date' => Carbon::createFromFormat('m/d/Y', $row['Inventory Date']),
            'certified' => $row['Certified'] === 'Yes',
            'description' => $row['Description'],
            'option_codes' => array_filter(explode(',', $row['Option Codes'])),
            'fuel_econ_city' => (is_numeric($row['City MPG'])) ? $row['City MPG'] : 0,
            'fuel_econ_hwy' => (is_numeric($row['Highway MPG'])) ? $row['Highway MPG'] : 0,
            'dealer_name' => $row['Dealer Name'],
            'days_old' => (is_numeric($row['Age'])) ? $row['Age'] : 0,
            'version_id' => $version->id,
            'source_price' => $pricing,
            // TODO: we should mark things as available if they are in the feed, but only if they weren't sold via DMR somehow.
            'status' => 'available',
            'sold_at' => null,
        ]);

        return $deal;
    }
}
