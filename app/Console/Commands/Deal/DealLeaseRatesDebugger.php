<?php

namespace App\Console\Commands\Deal;

use DeliverMyRide\DataDelivery\DataDeliveryClient;
use DeliverMyRide\DataDelivery\Manager\DealRatesAndRebatesManager;
use Illuminate\Console\Command;
use App\Models\Deal;

class DealLeaseRatesDebugger extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'dmr:leaserates';

    /**
     * The console command description.
     *
     * @var string
     */

    /* @var DataDeliveryClient */
    private $client;

    /**
     * @param DataDeliveryClient $client
     */
    public function __construct(DataDeliveryClient $client)
    {
        parent::__construct();
        $this->client = $client;
    }

    /**
     * Execute the console command.
     *
     * @return mixed
     */
    public function handle()
    {
        $deals = Deal::all();

        foreach($deals as $deal) {

            $manager = new DealRatesAndRebatesManager($deal, '48116', $this->client);
            $manager->setFinanceStrategy('lease');
            $manager->setConsumerRole('default');
            $manager->searchForVehicleAndPrograms();
            $manager->setScenario();

            $data = $manager->getData();

            if($data !== null){
                $this->info("Vin: {$deal->vin}");
                $this->info("Has Lease Rates: YES");
            } else {
                $this->info("Vin: {$deal->vin}");
                $this->info("Has Lease Rates: NO");
            }

        }
    }
}
