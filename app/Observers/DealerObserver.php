<?php

namespace App\Observers;

use App\Models\Dealer;
use App\Models\Deal;

class DealerObserver
{
    /**
     * Handle to the dealer "created" event.
     *
     * @param  \App\Dealer  $dealer
     * @return void
     */
    public function created(Dealer $dealer)
    {
        Deal::where('dealer_id', $dealer->dealer_id)->searchable();
    }

    /**
     * Handle the dealer "updated" event.
     *
     * @param  \App\Dealer  $dealer
     * @return void
     */
    public function updated(Dealer $dealer)
    {
        Deal::where('dealer_id', $dealer->dealer_id)->searchable();
    }

    /**
     * Handle the dealer "deleted" event.
     *
     * @param  \App\Dealer  $dealer
     * @return void
     */
    public function deleted(Dealer $dealer)
    {
        //
    }
}
