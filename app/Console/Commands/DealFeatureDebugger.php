<?php

namespace App\Console\Commands;

use App\Models\Feature;
use App\Models\Deal;
use DeliverMyRide\JATO\JatoClient;
use DeliverMyRide\VAuto\Deal\DealEquipmentMunger;
use Illuminate\Console\Command;

class DealFeatureDebugger extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'dmr:dealfeature {deal}';

    /**
     * The console command description.
     *
     * @var string
     */

    /* @var JatoClient */
    private $client;

    private $features;

    /**
     * @param JatoClient $client
     */
    public function __construct(JatoClient $client)
    {
        parent::__construct();

        $this->client = $client;
        $this->features = Feature::with('category')->get();

    }

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $dealId = $this->argument('deal');

        $deal = Deal::find($dealId);
        $this->info($deal->id);
        $this->info($deal->title());
        $this->info(" -- Option Codes: " . implode(", ", $deal->option_codes));

        $munger = new DealEquipmentMunger($deal, $this->client);
        $debug = $munger->import(true);

        $munger->printDiscoveredFeatures();
        print_r($debug['equipment_extracted_codes']);

        /*
        $munger->initializeData();}

        $header = [
            'Source: Features',
            'DMR: Provided OCs',
            'DMR: Extracted OCs',
            'DMR: Vauto Guessed Features',
            'DMR: End Result'
        ];

        $option_codes = $deal->option_codes;
        $extracted_option_codes = $munger->extractAdditionalOptionCodes();

        $original_option_codes = array_diff($option_codes, $extracted_option_codes);


        $this->info($deal->title());
        $this->info(" -- Original Option Codes: " . implode(", ", $original_option_codes));
        $this->info(" -- Extracted Option Codes: " . implode(", ", $extracted_option_codes));

        $rows = [];

        // Vauto
        $vautoFeatures = explode("|", $deal->vauto_features);
        $vautoFeatures = array_map('trim', $vautoFeatures);
        asort($vautoFeatures);
        $vautoFeatures = array_values($vautoFeatures);
        foreach ($vautoFeatures as $key => $feature) {
            if (!isset($rows[$key])) {
                $rows[$key] = ['', '', '', '', ''];
            }
            $rows[$key][0] = $feature;
        }

        //
        // Provided OCs
        $munger->initializeOptionCodes($original_option_codes);
        $providedOCIds = $munger->getFeaturesForDeal();
        $providedOC = Feature::whereIn('id', $providedOCIds)->orderBy('title', 'asc')->get()->pluck('title')->all();
        $providedOC = array_unique($providedOC);
        foreach ($providedOC as $key => $feature) {
            if (!isset($rows[$key])) {
                $rows[$key] = ['', '', '', '', ''];
            }
            $rows[$key][1] = $feature;
        }

        //
        // Extracted OCs
        $munger->initializeOptionCodes($extracted_option_codes);
        $extractedOCIds = $munger->getFeaturesForDeal();
        $extractedOC = Feature::whereIn('id', $extractedOCIds)->orderBy('title', 'asc')->get()->pluck('title')->all();
        foreach ($extractedOC as $key => $feature) {
            if (!isset($rows[$key])) {
                $rows[$key] = ['', '', '', '', ''];
            }
            $rows[$key][2] = $feature;
        }


        // Vauto Guessed
        $vautoGuessedFeatureIds = $munger->getGuessedvAutoFeatureIds();
        $vautoGuessedFeatures = Feature::whereIn('id', $vautoGuessedFeatureIds)->orderBy('title', 'asc')->get()->pluck('title')->all();
        foreach ($vautoGuessedFeatures as $key => $feature) {
            if (!isset($rows[$key])) {
                $rows[$key] = ['', '', '', '', ''];
            }
            $rows[$key][3] = $feature;
        }

        //
        // Total
        $allFeatures = array_merge($providedOC, $extractedOC, $vautoGuessedFeatures);
        $allFeatures = array_unique($allFeatures);
        asort($allFeatures);

        $allFeatures = array_values($allFeatures);

        foreach ($allFeatures as $key => $feature) {
            if (!isset($rows[$key])) {
                $rows[$key] = ['', '', '', '', ''];
            }

            $rows[$key][4] = $feature;
        }
        $this->table($header, $rows);
        */
    }
}
