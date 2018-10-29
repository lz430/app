<?php

namespace App\Console\Commands\Version;

use App\Models\Deal;
use App\Models\JATO\VersionQuote;
use DeliverMyRide\RIS\Manager\VersionToVehicle;
use DeliverMyRide\RIS\RISClient;
use App\Models\JATO\Version;

use DeliverMyRide\VAuto\VersionMunger;
use Illuminate\Console\Command;


class VersionRefresh extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'dmr:version:refresh {make}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Regenerate all version quotes';

    /* @var VersionMunger */
    private $manager;

    /**
     * Create a new command instance.
     * @param VersionMunger $manager
     * @return void
     */
    public function __construct(VersionMunger $manager)
    {
        parent::__construct();
        $this->manager = $manager;
    }

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $manager = $this->manager;
        $make = $this->argument('make');

        $query = Version::query();
        $query->whereHas('model', function ($query) use ($make) {
            $query->whereHas('make', function ($query) use ($make) {
                $query->where('name', '=', $make);
            });
        });

        $versions = $query->get()->all();

        foreach($versions as $version) {
            /* @var \App\Models\JATO\Version $version */
            $manager->refreshMakeModel($version);
            $this->info($version->model->make->name);
        }
    }
}
