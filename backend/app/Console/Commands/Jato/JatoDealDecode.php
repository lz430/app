<?php

namespace App\Console\Commands\Jato;

use App\Models\Deal;
use Illuminate\Console\Command;
use DeliverMyRide\JATO\JatoClient;

class JatoDealDecode extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'jato:dealdecode {deal}';

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
        $deal_id = $this->argument('deal');
        $deal = Deal::where('id', $deal_id)->first();
        $decoded = $this->client->vin->decode($deal->vin);
        print_r($decoded);
    }
}
