<?php

namespace App\Console\Commands;

use DeliverMyRide\DataDelivery\DataDeliveryClient;
use Illuminate\Console\Command;

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

    private $features;

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
        $response = $this->client->programdata->get(
            $vin,
            '48116',
            '48116');

        foreach ($response->vehicles as $vehicle) {
            foreach ($vehicle->programs as $program) {
                if (in_array($program->ProgramType, ['Text Only'])) {
                    continue;
                }
                $rows = [];
                $scenarios = $program->dealscenarios;

                unset($program->dealscenarios);
                unset($program->ProgramContent);
                foreach ($program as $key => $value) {
                    $rows[] = [$key, $value];
                }
                $rows[] = ["", ""];
                $rows[] = ["", ""];

                foreach ($scenarios as $scenario) {
                    $rows[] = ['DealScenarioType', $scenario->DealScenarioType];

                    if (isset($scenario->terms)) {
                        foreach ($scenario->terms as $term) {
                            $rows[] = [$term->QualifyingTermStart . " - " . $term->QualifyingTermEnd,];
                            $value = "";

                            foreach ($term->tiers[0] as $k => $v) {
                                $value .= "{$k} = {$v}\n";
                            }
                            $rows[] = ["Tier: {$term->tiers[0]->TierNo}", $value];
                        }
                    }

                    if (isset($scenario->tiers)) {
                        $value = "";

                        foreach ($scenario->tiers[0] as $k => $v) {
                            $value .= "{$k} = {$v}\n";
                        }
                        $rows[] = ["Tier: {$scenario->tiers[0]->TierNo}", $value];
                    }


                }

                $this->table(['key', 'value'], $rows);
            }
        }


        //print_r($response);

    }
}
