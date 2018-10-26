<?php

namespace App\Console\Commands\Deal;

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
    protected $signature = 'dmr:deal:feature {deal}';

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

        if (!$deal) {
            $this->info("NO DEAL!");
            return;
        }

        $munger = new DealEquipmentMunger($deal, $this->client);
        $debug = $munger->import(true);

        $deal->fresh();
        $this->info($deal->id);
        $this->info($deal->title());
        $this->info(" -- Option Codes: " . implode(", ", $deal->option_codes));
        $this->info(" -- Package Codes: " . implode(", ", $deal->package_codes));

        $munger->printDiscoveredFeatures();
    }
}