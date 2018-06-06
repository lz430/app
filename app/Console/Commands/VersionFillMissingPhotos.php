<?php

namespace App\Console\Commands;

use DeliverMyRide\Fuel\FuelClient;
use DeliverMyRide\Fuel\VersionToFuel;
use App\Models\JATO\Version;

use Illuminate\Console\Command;

class VersionFillMissingPhotos extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'dmr:version:fillmissingphotos';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Fill Missing Photos';

    /* @var FuelClient */
    private $client;

    /**
     * Create a new command instance.

     * @param FuelClient $client
     * @return void
     */
    public function __construct(FuelClient $client)
    {
        parent::__construct();

        $this->client = $client;
    }

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $versions = Version::doesntHave('photos')->has('deals')->orderBy('year', 'desc')->get();
        $client = $this->client;
        $versions->map(function ($item) use ($client) {
            $manager = new VersionToFuel($item, $client);
            //$vehicle = $manager->matchFuelVehicleToVersion();
            $assets = $manager->assets();
            if ($assets && count($assets)) {
                $this->info($item->id);
                $item->photos()->delete();

                foreach ($assets as $asset) {
                    $item->photos()->create([
                        'url' => $asset->url,
                        'shot_code' => $asset->shotCode->code,
                        'color' => 'default',
                    ]);
                }
            }

            return $item;
        });

    }
}
