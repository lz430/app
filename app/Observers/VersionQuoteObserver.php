<?php

namespace App\Observers;

use App\Models\JATO\VersionQuote;

class VersionQuoteObserver
{
    /**
     * Handle to the quote "created" event.
     *
     * @param VersionQuote $quote
     * @return void
     */
    public function created(VersionQuote $quote)
    {

    }

    /**
     * Handle the quote "updated" event.
     *
     * @param VersionQuote $quote
     * @return void
     */
    public function updated(VersionQuote $quote)
    {

    }

    /**
     * Handle the quote "deleted" event.
     *
     * @param VersionQuote $quote
     * @return void
     */
    public function deleted(VersionQuote $quote)
    {
        //
    }
}
