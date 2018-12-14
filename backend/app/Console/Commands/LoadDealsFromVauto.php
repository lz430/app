<?php

namespace App\Console\Commands;

use DB;
use Illuminate\Console\Command;
use DeliverMyRide\VAuto\Importer;

class LoadDealsFromVauto extends Command
{
    protected $signature = 'vauto:load {--force}';
    protected $description = 'Load vehicles from Vauto.';
    private $importer;

    public function __construct(Importer $importer)
    {
        parent::__construct();

        $importer->setInfoFunction(function (string $info) {
            $this->info($info);
        });

        $importer->setErrorFunction(function (string $error) {
            $this->error($error);
        });

        $this->importer = $importer;
    }

    public function handle()
    {
        if ($this->option('force')) {
            $this->info('truncated deals table, deal_features table, deal_photos table and running importer');
            DB::statement('SET FOREIGN_KEY_CHECKS=0;');
            DB::table('deals')->truncate();
            DB::statement('SET FOREIGN_KEY_CHECKS=1;');
            DB::table('deal_feature')->truncate();
            DB::table('deal_photos')->truncate();
            $this->importer->import();
        } else {
            $this->importer->import();
        }
    }
}
