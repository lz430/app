<?php

namespace App\Console\Commands\Jato;

use App\Models\Deal;
use DeliverMyRide\JATO\JatoClient;
use League\Csv\Writer;

use Illuminate\Console\Command;

class JatoVersionReport extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'dmr:jatoversionreport {path}';

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
        $path = $this->argument('path');
        $csv = Writer::createFromPath("$path", "w");

        $header = [
            'Deal Id',
            'Vin',
            'Jato UID',
            'Jato Vehicle Id',
            'Jato Version Name',
            'Jato Model Name',
            'Jato Model Code',
            'Jato Trim Name',
            'Jato Is Current',
        ];

        $csv->insertOne($header);

        $deals = Deal::all();

        foreach ($deals as $deal) {
            $this->info("Deal: {$deal->id}");
            $decoded = $this->client->vin->decode($deal->vin);
            foreach ($decoded->versions as $version) {
                $data = [
                    $deal->id,
                    $deal->vin,
                    $version->uid,
                    $version->vehicle_ID,
                    $version->versionName,
                    $version->modelName,
                    $version->modelCode,
                    $version->trimName,
                    $version->isCurrent,
                ];

                $csv->insertOne($data);
            }

        }

    }
}
