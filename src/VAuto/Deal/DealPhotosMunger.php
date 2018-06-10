<?php

namespace DeliverMyRide\VAuto\Deal;

use App\Models\Deal;
use DeliverMyRide\Fuel\FuelClient;
use DeliverMyRide\Fuel\VersionToFuel;

/**
 *
 */
class DealPhotosMunger
{
    private $debug;
    private $deal;
    private $row;
    private $fuelClient;

    /**
     * @param Deal $deal
     * @param array $row
     * @param FuelClient $fuelClient
     */
    public function __construct(Deal $deal, array $row, FuelClient $fuelClient)
    {
        $this->deal = $deal;
        $this->row = $row;
        $this->fuelClient;
    }

    /**
     *
     */
    public function import() {

        // On create or no photos
        if ($this->deal->wasRecentlyCreated || !$this->deal->photos()->count()) {
            $this->saveDealPhotos();
        }

        // If still no photos attempt to attach some stock photos to the version.
        if (!$this->deal->photos()->count()) {
            $this->saveDealStockPhotos();
        }

        return $this->debug;
    }

    /**
     * Save deal photos from import file
     */
    private function saveDealPhotos()
    {
        $deal = $this->deal;
        $photos = $this->row['Photos'];

        $saved_some_photos = FALSE;
        collect(explode('|', $photos))
            ->reject(function ($photoUrl) {
                return $photoUrl == '';
            })
            ->each(function ($photoUrl) use ($deal, &$saved_some_photos) {
                $deal->photos()->firstOrCreate(['url' => str_replace('http', 'https', $photoUrl)]);
                $saved_some_photos = TRUE;
            });
    }

    /**
     * In the event a deal does not have any photos, we attempt to load some from fuel api.
     */
    private function saveDealStockPhotos()
    {
        $deal = $this->deal;

        // only do this if we have a color.
        if (!$deal->color) {
            return;
        }

        // Only save stock photos if we don't have any already.
        if ($deal->version->photos()->where('color', '=', $deal->color)->count()) {
            return;
        }

        $assets = (new VersionToFuel($deal->version, $this->fuelClient))->assets($deal->color);
        foreach ($assets as $asset) {
            $deal->version->photos()->create([
                'url' => $asset->url,
                'shot_code' => $asset->shotCode->code,
                'color' => $deal->color,
            ]);
        }
    }
}
