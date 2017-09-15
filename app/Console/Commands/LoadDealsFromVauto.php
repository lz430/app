<?php

namespace App\Console\Commands;

use DeliverMyRide\VAuto\Importer;
use Illuminate\Console\Command;

class LoadDealsFromVauto extends Command
{
    protected $signature = 'vauto:load';
    protected $description = 'Load vehicles from Vauto.';
    private $importer;

    public function __construct(Importer $importer)
    {
        parent::__construct();

        $importer->setInfoFunction(function (string $info) {
            $this->info($info);
        });

        $this->importer = $importer;
    }

    public function handle()
    {
        $this->importer->import();
    }
}
