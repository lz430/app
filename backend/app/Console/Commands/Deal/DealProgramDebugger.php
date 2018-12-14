<?php

namespace App\Console\Commands\Deal;

use App\Models\Deal;
use Illuminate\Console\Command;
use DeliverMyRide\DataDelivery\DataDeliveryClient;
use DeliverMyRide\DataDelivery\Manager\DealRatesAndRebatesManager;

class DealProgramDebugger extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'dmr:deal:programs {vin}';

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

        $manager = new DealRatesAndRebatesManager($deal, '48116', 'employee', $this->client);
        $manager->setFinanceStrategy('lease');
        $manager->setConsumerRole('employee');
        $manager->searchForVehicleAndPrograms();
        $manager->setScenario();
        $conditionals = $manager->getPotentialConditionals();

        print_r($conditionals);

        //$data = $manager->getData();
        //print_r($data);
    }
}
