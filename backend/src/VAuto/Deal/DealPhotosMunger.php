<?php

namespace DeliverMyRide\VAuto\Deal;

use App\Models\Deal;
use Carbon\Carbon;

/**
 *
 */
class DealPhotosMunger
{
    private $debug;

    /* @var Deal */
    private $deal;

    /* @var array */
    private $row;

    /**
     * @param Deal $deal
     * @param array $row
     * @param bool $force
     * @return array
     */
    public function import(Deal $deal, array $row, bool $force = FALSE)
    {
        $this->debug = [
            'deal_photos' => 0,
            'stock_photos' => 0,
            'deal_photos_skipped' => 'Yes',
            'deal_photos_refreshed' => 'No',
        ];

        $this->deal = $deal;
        $this->row = $row;

        $modifiedDate = $row['Photos Last Modified Date'];
        $modifiedDate = Carbon::parse($modifiedDate);
        $shouldRefreshPhotos = false;
        if (!$deal->wasRecentlyCreated && (!$deal->photos_updated_at || $deal->photos_updated_at < $modifiedDate)) {
            $shouldRefreshPhotos = true;
            $this->debug['deal_photos_refreshed'] = 'Yes';
        }

        // When No photos.
        if (!$this->deal->photos()->count() || $shouldRefreshPhotos || $force) {
            $this->debug['deal_photos_skipped'] = 'No';
            $this->saveDealPhotos();

            // Not great to introduce another save here but we need to compare the photo modified
            // value to the previous value
            $deal->photos_updated_at = $modifiedDate;
            $deal->save();
        }

        //
        // Usually we skip the first photo, so load some stock if have less than two deal photos.
        if ($this->deal->photos()->count() < 2) {
            $this->debug['deal_photos_skipped'] = 'No';
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
        $deal->photos()->delete();
        $photos = $this->row['Photos'];

        $saved_some_photos = 0;
        collect(explode('|', $photos))
            ->reject(function ($photoUrl) {
                return $photoUrl == '';
            })
            ->each(function ($photoUrl) use ($deal, &$saved_some_photos) {
                $deal->photos()->firstOrCreate(['url' => str_replace('http', 'https', $photoUrl)]);
                $saved_some_photos++;
            });

        $this->debug['deal_photos'] = $saved_some_photos;
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

        $count = 0;

        $assets = resolve('DeliverMyRide\Fuel\Manager\VersionToFuel')->assets($deal->version, $deal->color);
        foreach ($assets as $asset) {
            $deal->version->photos()->create([
                'url' => $asset->url,
                'shot_code' => $asset->shotCode->code,
                'color' => $deal->color,
            ]);
            $count++;
        }

        $this->debug['stock_photos'] = $count;
    }
}
