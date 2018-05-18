<?php

namespace App\Console\Commands;

use DeliverMyRide\JATO\JatoClient;
use Illuminate\Console\Command;

class JatoDebug extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'dmr:jato {vin}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Jato Debugger';

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
        $vin = $this->argument('vin');
        $decodedVin = $this->client->vin->decode($vin);
        print_r($decodedVin);

        $version = '769729120180301';
        print_r($this->client->version->get($version));

    }
}
