<?php

namespace App\Console\Commands\Jato;

use App\Models\Deal;
use Illuminate\Console\Command;
use DeliverMyRide\JATO\JatoClient;

class JatoFindMissingVersions extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'dmr:findmissingversions';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Deals Missing Jato Versions';

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
        $deals = Deal::all();

        foreach ($deals as $deal) {
            $decoded = $this->client->vin->decode($deal->vin);
            if (! count($decoded->versions)) {
                $this->info($deal->vin);
                print_r($decoded);
            }
        }
    }
}
