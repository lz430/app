<?php

namespace App\Console\Commands;

use App\Models\Filter;
use League\Csv\Reader;
use Illuminate\Console\Command;
use DeliverMyRide\JATO\JatoClient;

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
     *
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
            $vauto_feature = preg_replace("/( *\d+(, *\d+)*|s\..*)$/", '', $record['vAuto Filter Stipped']);

            // Remove utf8 chars.
            $vauto_feature = preg_replace('/[\x00-\x1F\x7F\xA0]/u', '', $vauto_feature);

            if ($record['DMR Filter'] !== 'Yes') {
                continue;
            }

            $filters = [
                $record['DMR Name'],
                $record['2nd DMR Name'],
                $record['3rd DMR Name'],
            ];

            $filters = array_map('trim', $filters);
            $filters = array_filter($filters);

            foreach ($filters as $feature_name) {
                $filter = Filter::where('title', $feature_name)->first();
                if ($filter) {
                    $vautoData = $filter->map_vauto_features;
                    if (! $vautoData) {
                        $vautoData = [];
                    }

                    $vautoData[] = $vauto_feature;
                    $vautoData = array_unique($vautoData);
                    print_r($vautoData);
                    $filter->map_vauto_features = $vautoData;
                    $filter->save();
                }
            }

            $this->info($vauto_feature);
            print_r($record);
        }
    }
}
