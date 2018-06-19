<?php

namespace App\Console\Commands;

use DeliverMyRide\DataDelivery\DataDeliveryClient;
use DeliverMyRide\DataDelivery\Manager\DealRatesAndRebatesManager;
use Illuminate\Console\Command;
use App\Models\Deal;

class DealProgramDebugger extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'dmr:programs {vin}';

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
     */
    public function handle()
    {
        $vin = $this->argument('vin');
        $deal = Deal::where('vin', $vin)->first();

        $manager = new DealRatesAndRebatesManager($deal, '48116', $this->client);
        $manager->setFinanceStrategy('lease');
        $manager->setConsumerRole('default');
        $manager->searchForVehicleAndPrograms();
        $manager->setScenario();

        $data = $manager->getData();
        print_r($data);
    }
}