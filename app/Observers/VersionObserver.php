<?php

namespace App\Observers;

use App\Models\JATO\Version;

class VersionObserver
{
    /**
     * Handle to the version "created" event.
     *
     * @param  \App\Version  $version
     * @return void
     */
    public function created(Version $version)
    {
        $version
            ->with('deals')
            ->where('id', $version->id)
            ->searchable();
    }

    /**
     * Handle the version "updated" event.
     *
     * @param  \App\Version  $version
     * @return void
     */
    public function updated(Version $version)
    {
        $version
            ->with('deals')
            ->where('id', $version->id)
            ->searchable();
    }

    /**
     * Handle the version "deleted" event.
     *
     * @param  \App\Version  $version
     * @return void
     */
    public function deleted(Version $version)
    {
        //
    }
}
