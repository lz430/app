<?php

namespace App\Console\Commands\Tests;

use Illuminate\Console\Command;
use DeliverMyRide\RIS\RISClient;

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
        $response = $this->client->test->getAdvertisedDealScenarios();
        print_r($response);
    }
}
