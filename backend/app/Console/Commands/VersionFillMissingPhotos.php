<?php

namespace App\Console\Commands;

use DeliverMyRide\Fuel\FuelClient;
use DeliverMyRide\Fuel\Manager\VersionToFuel;
use App\Models\JATO\Version;

use Illuminate\Console\Command;

class VersionFillMissingPhotos extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'dmr:version:updatephotos';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Fill Missing Photos';

    /* @var VersionToFuel */
    private $manager;

    /**
     * @param VersionToFuel $manager
     */
    public function __construct(VersionToFuel $manager)
    {
        parent::__construct();
        $this->manager = $manager;
    }

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $versions = Version::doesntHave('photos')->has('deals')->orderBy('year', 'desc')->get();
        $versions->map(function ($version) {
            /* @var \App\Models\JATO\Version $version */

            $assets = $this->manager->assets($version);
            if ($assets && count($assets)) {
                $this->info($version->title());
                $version->photos()->delete();
                foreach ($assets as $asset) {
                    $version->photos()->create([
                        'url' => $asset->url,
                        'type' => 'default',
                        'shot_code' => $asset->shotCode->code,
                        'color' => null,
                        'description' => trim($asset->shotCode->description),
                    ]);
                }
            }
            return $version;
        });

    }
}
