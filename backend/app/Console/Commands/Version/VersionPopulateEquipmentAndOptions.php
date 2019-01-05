<?php

namespace App\Console\Commands\Version;

use App\Models\JATO\Option;
use App\Models\JATO\Version;
use App\Models\JATO\Equipment;
use DeliverMyRide\VAuto\VersionMunger;
use Illuminate\Console\Command;
use App\Models\JATO\StandardText;
use DeliverMyRide\JATO\JatoClient;
use Illuminate\Support\Facades\DB;
use GuzzleHttp\Exception\ClientException;
use GuzzleHttp\Exception\ServerException;

class VersionPopulateEquipmentAndOptions extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'dmr:version:equipment {version?}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Refreshes packages and options from jato in bulk';

    /** @var VersionMunger */
    protected $versionManager;

    /**
     * VersionPopulateEquipmentAndOptions constructor.
     * @param VersionMunger $manager
     */
    public function __construct(VersionMunger $manager)
    {
        parent::__construct();
        $this->versionManager = $manager;
    }

    /**
     * Execute the console command.
     *
     * @return mixed
     */
    public function handle()
    {
        $versionId = $this->argument('version');
        if ($versionId) {
            $version = Version::find($versionId);

            if (!$version) {
                $this->info('NO VERSION FOUND!');
                return false;
            }

            $versions = collect([$version]);
        } else {
            $versions = Version::whereHas('deals', function ($query) {
                $query->where('status', 'available');
            })->get();
        }

        foreach ($versions as $version) {
            $this->info($version->title());
            $this->versionManager->refreshVersionEquipment($version);
        }
        return true;
    }
}
