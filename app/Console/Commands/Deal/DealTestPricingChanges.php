<?php

namespace App\Console\Commands\Deal;

use App\Models\Feature;
use App\Models\Deal;
use DeliverMyRide\JATO\JatoClient;
use DeliverMyRide\VAuto\Deal\DealEquipmentMunger;
use Illuminate\Console\Command;

class DealTestPricingChanges extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'dmr:deal:update-price {deal}';

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

        $pricing = $deal->source_price;
        $pricing->msrp = $pricing->msrp + 1;
        $pricing->price = $pricing->price + 1;
        $pricing->sticker = $pricing->sticker + 1;
        $pricing->dealerdiscounted = $pricing->dealerdiscounted + 1;

        $deal->source_price = $pricing;
        $deal->save();
    }
}
