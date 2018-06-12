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
    }
}
