<?php

namespace App\Observers;

use App\Models\Feature;
use App\Models\Deal;

class FeatureObserver
{
    /**
     * Handle to the feature "created" event.
     *
     * @param  \App\Feature  $feature
     * @return void
     */
    public function created(Feature $feature)
    {
        Deal::whereHas('features', function($query) use ($feature) {
            $query->where('features.id', $feature->id);
        })->searchable();
    }

    /**
     * Handle the feature "updated" event.
     *
     * @param  \App\Feature  $feature
     * @return void
     */
    public function updated(Feature $feature)
    {
        Deal::whereHas('features', function($query) use ($feature) {
              $query->where('features.id', $feature->id);
        })->searchable();
    }

    /**
     * Handle the feature "deleted" event.
     *
     * @param  \App\Feature  $feature
     * @return void
     */
    public function deleted(Feature $feature)
    {
        //
    }
}
