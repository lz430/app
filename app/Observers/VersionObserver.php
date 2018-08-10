<?php

namespace App\Observers;

use App\Models\JATO\Version;

class VersionObserver
{
    /**
     * Handle to the version "created" event.
     *
     * @param Version $version
     * @return void
     */
    public function created(Version $version)
    {
        $version->deals()->searchable();
    }

    /**
     * Handle the version "updated" event.
     *
     * @param Version $version
     * @return void
     */
    public function updated(Version $version)
    {
        $version->deals()->searchable();
    }

    /**
     * Handle the version "deleted" event.
     *
     * @param Version $version
     * @return void
     */
    public function deleted(Version $version)
    {
        //
    }
}
