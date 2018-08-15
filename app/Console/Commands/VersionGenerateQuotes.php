<?php

namespace App\Console\Commands;

use DeliverMyRide\RIS\Manager\VersionToVehicle;
use DeliverMyRide\RIS\RISClient;
use App\Models\JATO\Version;

use Illuminate\Console\Command;


class VersionGenerateQuotes extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'dmr:version:quote';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Fill Missing Photos';

    /* @var RISClient */
    private $client;

    /**
     * Create a new command instance.

     * @param RISClient $client
     * @return void
     */
    public function __construct(RISClient $client)
    {
        parent::__construct();

        $this->client = $client;
    }

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $versions = Version::has('deals')->orderBy('year', 'desc')->get();
        $client = $this->client;
        $versions->map(function ($version) use ($client) {
            $vehicle = (new VersionToVehicle($version, '48116', $client))->get();
            $this->info($version->title());

            /*
            if (isset($vehicle->vehicle->cashDealScenarios)) {
                foreach($vehicle->vehicle->cashDealScenarios as $cash) {
                    $this->info("  -- " . $cash->dealScenarioTypeName . " : $" . $cash->consumerCash->totalConsumerCash);
                }

            }
            */
        });

    }
}
