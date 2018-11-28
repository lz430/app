<?php

namespace App\Console\Commands\Tests;

use App\Models\Order\Purchase;
use Illuminate\Console\Command;
use DeliverMyRide\HubSpot\Manager\SyncPurchaseWithHubspot;

class TestHubSpotForm extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'dmr:test:hubspotform {purchase}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Test Hubspot Purhcase';

    /* @var SyncPurchaseWithHubspot */
    private $manager;

    /**
     * Create a new command instance.
     * @param SyncPurchaseWithHubspot $manager
     * @return void
     */
    public function __construct(SyncPurchaseWithHubspot $manager)
    {
        parent::__construct();

        $this->manager = $manager;
    }

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $purchaseId = $this->argument('purchase');
        $purchase = Purchase::where('id', $purchaseId)->first();
        $this->manager->submitPurchaseForm($purchase);
    }
}
