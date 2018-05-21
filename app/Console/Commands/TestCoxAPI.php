<?php

namespace App\Console\Commands;

use DeliverMyRide\Cox\CoxClient;
use Illuminate\Console\Command;

class TestCoxAPI extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'dmr:coxtest';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Quick and dirty cox api test';

    /* @var CoxClient */
    private $client;

    /**
     * Create a new command instance.

     * @param CoxClient $client
     * @return void
     */
    public function __construct(CoxClient $client)
    {
        parent::__construct();

        $this->client = $client;
    }

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $response = $this->client->test->getAdvertisedDealScenarios();
        print_r($response);
    }
}
