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
        $versions = Version::doesntHave('photos')->has('deals')->orderBy('year', 'asc')->get();
        $versions->map(function ($version) {
            /* @var \App\Models\JATO\Version $version */
            //
            // Default
            $version->photos()->delete();

            $vehicle = $this->manager->matchFuelVehicleToVersion($version);
            if (!$vehicle) {
                return $version;
            }

            $this->info($version->title());

            //
            // Default Assets
            $assets = $this->manager->assets($version, null, $vehicle->id);
            if ($assets && count($assets)) {
                $this->info(" --- Default: " . count($assets));
                foreach ($assets as $asset) {
                    $version->photos()->updateOrCreate(
                        [
                            'url' => $asset->url
                        ],
                        [
                            'type' => 'default',
                            'shot_code' => $asset->shotCode->code,
                            'color' => null,
                            'description' => isset($asset->shotCode->description) ? trim($asset->shotCode->description) : null,
                        ]);
                }
            }

            //
            // Colorized Assets
            $colors = $version
                ->deals()
                ->get()
                ->pluck('color')
                ->unique()
                ->all();


            if ($colors && count($colors)) {
                foreach ($colors as $color) {
                    if (!$color) {
                        continue;
                    }
                    $assets = $this->manager->assets($version, $color);
                    if ($assets && count($assets)) {
                        $this->info(" --- " . $color . ": " . count($assets));
                        foreach ($assets as $asset) {

                            if (!isset($asset->shotCode->color->oem_name)) {
                                continue;
                            }

                            $version->photos()->updateOrCreate(
                                [
                                    'url' => $asset->url
                                ],
                                [
                                    'type' => 'color',
                                    'shot_code' => $asset->shotCode->code,
                                    'color' => $asset->shotCode->color->oem_name,
                                    'color_simple' => $asset->shotCode->color->simple_name,
                                    'color_rgb' => $asset->shotCode->color->rgb1,
                                    'description' => isset($asset->shotCode->description) ? trim($asset->shotCode->description) : null,
                                ]);
                        }
                    }

                }

            }


            return $version;
        });

    }
}
