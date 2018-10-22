<?php

namespace App\Console\Commands\Deal;

use App\Models\Feature;
use App\Models\Deal;
use DeliverMyRide\Fuel\Manager\VersionToFuel;
use DeliverMyRide\JATO\JatoClient;
use DeliverMyRide\VAuto\Deal\DealEquipmentMunger;
use Illuminate\Console\Command;

class DealStockPhotos extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'dmr:deal:stockphotos {deal}';

    /**
     * The console command description.
     *
     * @var string
     */

    /* @var VersionToFuel */
    private $manager;

    /**
     * @param VersionToFuel $manager
     */
    public function __construct(VersionToFuel $manager)
    {
        parent::__construct();
        $this->manager = $manager;
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
        $assets = $this->manager->assets($deal->version, $deal->color);

        dd($assets);

    }
}
