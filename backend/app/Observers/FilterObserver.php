<?php

namespace App\Observers;

use App\Models\Deal;
use App\Models\Filter;

class FilterObserver
{
    /**
     * Handle to the filter "created" event.
     *
     * @param  \App\Filter  $filter
     * @return void
     */
    public function created(Filter $filter)
    {
        Deal::whereHas('filters', function ($query) use ($filter) {
            $query->where('filters.id', $filter->id);
        })->searchable();
    }

    /**
     * Handle the filter "updated" event.
     *
     * @param  \App\Filter  $filter
     * @return void
     */
    public function updated(Filter $filter)
    {
        Deal::whereHas('filters', function ($query) use ($filter) {
            $query->where('filters.id', $filter->id);
        })->searchable();
    }

    /**
     * Handle the filter "deleted" event.
     *
     * @param  \App\Filter  $filter
     * @return void
     */
    public function deleted(Filter $filter)
    {
        //
    }
}
