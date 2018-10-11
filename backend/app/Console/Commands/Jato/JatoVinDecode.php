<?php

namespace App\Console\Commands\Jato;

use DeliverMyRide\JATO\JatoClient;

use Illuminate\Console\Command;
use App\Models\Deal;


class JatoVinDecode extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'jato:vindecode {vin}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Jato Version Report';

    /* @var JatoClient */
    private $client;

    /**
     * Create a new command instance.
     * @param JatoClient $client
     * @return void
     */
    public function __construct(JatoClient $client)
    {
        parent::__construct();

        $this->client = $client;
    }

    /**
     * Execute the console command.
     */
    public function handle()
    {
        //
        $vin = $this->argument('vin');
        $decoded = $this->client->vin->decode($vin);
        print_r($decoded);

    }
}
