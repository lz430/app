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
        $this->importer->import($this->option('force'));
    }
}
