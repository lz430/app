<?php

namespace App\Console\Commands;

use App\Models\Order\Purchase;
use DeliverMyRide\HubSpot\HubspotClient;
use DeliverMyRide\RIS\RISClient;
use Illuminate\Console\Command;
use PHPUnit\Util\PHP\AbstractPhpProcess;
use SevenShores\Hubspot\Factory;

class TestHubSpotAPI extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'dmr:hubspot {purchase}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Quick and dirty cox api test';

    /* @var HubspotClient */
    private $client;

    /**
     * Create a new command instance.
     * @param RISClient $client
     * @return void
     */
    public function __construct(HubspotClient $client)
    {
        parent::__construct();
        $this->client = $client;
    }

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $purchaseId = $this->argument('purchase');
        $purchase = Purchase::where('id', $purchaseId)->first();
        $hubSpotManager = resolve('DeliverMyRide\HubSpot\Manager\SyncPurchaseWithHubspot');
        $hubSpotManager->createContactAndDeal($purchase);
    }
}
