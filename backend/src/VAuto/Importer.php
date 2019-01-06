<?php

namespace DeliverMyRide\VAuto;

use DeliverMyRide\VAuto\Deal\DealMunger;
use Exception;
use Carbon\Carbon;
use App\Models\Deal;
use App\Models\Dealer;
use League\Csv\Reader;
use League\Csv\Statement;
use DeliverMyRide\JATO\JatoClient;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Database\QueryException;
use GuzzleHttp\Exception\ClientException;
use GuzzleHttp\Exception\ServerException;
use League\Flysystem\FileExistsException;
use App\Notifications\NotifyToSlackChannel;
use Illuminate\Support\Facades\Notification;

class Importer
{
    private const HEADERS = [
        'DealerId',
        'Stock #',
        'VIN',
        'New/Used',
        'Year',
        'Make',
        'Model',
        'Model Code',
        'Body',
        'Transmission',
        'Series',
        'Series Detail',
        'Door Count',
        'Odometer',
        'Engine Cylinder Ct',
        'Engine Displacement',
        'Drivetrain Desc',
        'Colour',
        'Interior Color',
        'Price',
        'MSRP',
        'Inventory Date',
        'Certified',
        'Description',
        'Features',
        'City MPG',
        'Highway MPG',
        'Photo Count',
        'Photos',
        'Photos Last Modified Date',
        'Dealer Name',
        'Engine',
        'Fuel',
        'Age',
        'Option Codes',
        'Invoice',
        'Sticker',
        'Dealer Discounted',
        'MEMOLINE1',
        'MEMOLINE2',
        'FLOORPLANAMOUNT',
        'SALESCOST',
        'INVOICEAMOUNT',

    ];

    private const PROCESS_BATCH_SIZE = 100;

    /* @var JatoClient */
    private $jatoClient;

    private $error;
    private $info;
    private $debug;
    private $force;

    /* @var VautoFileManager */
    private $fileManager;

    /* @var VersionMunger */
    private $versionManager;

    /* @var DealMunger */
    private $dealManager;

    public function __construct(
        JatoClient $jatoClient,
        VautoFileManager $fileManager,
        VersionMunger $versionManager,
        DealMunger $dealManager
    )
    {
        $this->jatoClient = $jatoClient;
        $this->fileManager = $fileManager;
        $this->versionManager = $versionManager;
        $this->dealManager = $dealManager;

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
        return $this->fileManager->downloadAllFiles();
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
            $start = microtime(true);
            list($version, $versionDebugData) = $this->versionManager->build($row);
            $this->info("Deal: {$row['VIN']} - {$row['Stock #']}");

            if (isset($versionDebugData['versionPhotos'])) {
                $this->debug['versionPhotosUpdated'] = $versionDebugData['versionPhotos'];
            }

            //
            // Fail if we don't have a version
            if (!$version) {
                Log::channel('jato')->error('Could not find exact match for VIN -> JATO Version', [
                    'VAuto Row' => $row,
                ]);
                $this->debug['erroredVins']++;
                $this->info('    -- Error: Could not find match for vin');

                return;
            }

            if ($version->wasRecentlyCreated) {
                $this->debug['versionsCreated']++;
            } else {
                $this->debug['versionsUpdated']++;
            }

            $deal = Deal::withoutSyncingToSearch(function () use ($version, $row) {
                return $this->dealManager->saveOrUpdateDeal($version, $row['file_hash'], $row);
            });

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
            $this->info('    -- Is New: ' . ($deal->wasRecentlyCreated ? 'Yes' : 'No'));

            $debug = DB::transaction(function () use ($deal, $row, $start) {
                return $this->dealManager->decorate($deal, $row, $this->force);
            });

            $deal->searchable();

            // Equipment
            $this->info("    -- Equipment: Skipped?: {$debug['equipment_skipped']}");

            if (count($debug['options_extracted_codes'])) {
                $codes = collect($debug['options_extracted_codes'])->pluck('Option Code')->all();
                $msg = implode(', ', $codes);
                $this->info("    -- Equipment: Extracted Option Codes: {$msg}");
            }

            // Photos
            $this->info("    -- Photos: Skipped?: {$debug['deal_photos_skipped']}");
            $this->info("    -- Photos: Refreshed?: {$debug['deal_photos_refreshed']}");
            $this->info("    -- Photos: Deal Photos: {$debug['deal_photos']}");
            $this->info("    -- Photos: Stock Photos: {$debug['stock_photos']}");

            $stop = microtime(true);
            $this->info("    -- Took: " . ($stop - $start));
            if ($debug['deal_photos_refreshed'] == 'Yes') {
                $this->debug['dealPhotosRefreshed']++;
            }

            if ($debug['stock_photos'] > 0) {
                $this->debug['dealStockPhotos']++;
            }
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
     * @param bool $force
     * @return bool
     * @throws \GuzzleHttp\Exception\GuzzleException
     */
    public function import($force = false)
    {
        $this->force = $force;
        \DB::connection()->disableQueryLog();

        $sources = $this->buildSourceData();

        if (!count($sources)) {
            $this->info('No Files found to import!');

            return false;
        }

        $hashes = [];
        foreach ($sources as $source) {
            $this->parseSourceData($source);
            $hashes[] = $source['hash'];
        }

        $queryToDelete = Deal::whereRaw('created_at <= DATE_SUB(NOW(), INTERVAL 6 MONTH)')->whereDoesntHave('purchases');
        $queryUpdateSold = Deal::whereNotIn('file_hash', $hashes)->where('status', '=', 'available');

        $this->info('RESULTS ::::');
        $this->info(' -- Created Deals: ' . $this->debug['dealsCreated']);
        $this->info(' -- Updated Deals: ' . $this->debug['dealsUpdated']);
        $this->info(' -- Skipped Deals: ' . $this->debug['skipped']);
        $this->info(' -- Records to remove from es: ' . $queryUpdateSold->count());
        $this->info(' -- Records to delete from db: ' . $queryToDelete->count());

        // Sets status of deals that are not in feed to sold
        $queryUpdateSold->update(
            [
                'status' => 'sold',
                'sold_at' => Carbon::now(),
            ]);
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
            ],
        ];

        Notification::route('slack', config('services.slack.webhook'))
            ->notify(new NotifyToSlackChannel($data));
        try {
            $this->fileManager->archiveFiles($sources);
        } catch (FileExistsException $e) {
        }

        return true;
    }

    /**
     * @param $endTime
     * @param $startTime
     * @return string
     */
    private function formatTimePeriod($endTime, $startTime)
    {
        $duration = $endTime - $startTime;
        $hours = (int)($duration / 60 / 60);
        $minutes = (int)($duration / 60) - $hours * 60;
        $seconds = (int)$duration - $hours * 60 * 60 - $minutes * 60;

        return ($hours == 0 ? '00' : $hours) . ' Hours ' . ($minutes == 0 ? '00' : ($minutes < 10 ? '0' . $minutes : $minutes)) . ' Minutes ' . ($seconds == 0 ? '00' : ($seconds < 10 ? '0' . $seconds : $seconds)) . ' Seconds ';
    }
}
