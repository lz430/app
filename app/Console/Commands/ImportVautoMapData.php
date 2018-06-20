<?php

namespace App\Console\Commands;

use DeliverMyRide\JATO\JatoClient;
use Illuminate\Console\Command;

use App\Models\Feature;

use League\Csv\Reader;
use League\Csv\Statement;


class ImportVautoMapData extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'dmr:importvautomap {path}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Import Vauto Map';

    /* @var JatoClient */
    private $client;

    /**
     * Create a new command instance.

     * @param JatoClient $client
     * @return void
     */
    public function __construct()
    {
        parent::__construct();

    }

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $path = $this->argument('path');

        $csv = Reader::createFromPath($path, 'r');
        $csv->setHeaderOffset(0);

        foreach ($csv as $record) {
            // Remove counts at the end of the string
            $vauto_feature = preg_replace("/( *\d+(, *\d+)*|s\..*)$/", "", $record['vAuto Feature']);

            // Remove utf8 chars.
            $vauto_feature = preg_replace('/[\x00-\x1F\x7F\xA0]/u', '', $vauto_feature);

            if ($record['DMR Feature'] !== 'Yes') {
                continue;
            }

            $features = [
                $record['DMR Name'],
                $record['2nd DMR Name'],
                $record['3rd DMR Name'],
            ];

            $features = array_map("trim", $features);
            $features = array_filter($features);

            foreach($features as $feature_name) {
                $feature = Feature::where('title', $feature_name)->get()->first();
                if ($feature) {
                    $vautoData = $feature->map_vauto_features;
                    if (!$vautoData) {
                        $vautoData = [];
                    }

                    $vautoData[] = $vauto_feature;
                    $vautoData = array_unique($vautoData);
                    print_r($vautoData);
                    $feature->map_vauto_features = $vautoData;
                    $feature->save();
                }

            }

            $this->info($vauto_feature);
            print_r($record);
        }




    }
}
