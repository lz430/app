<?php

namespace App\Observers;

use App\Models\Purchase;
use App\Models\Deal;

class PurchaseObserver
{
    /**
     * Handle to the purchase "created" event.
     *
     * @param  \App\Purchase  $purchase
     * @return void
     */
    public function created(Purchase $purchase)
    {
        Deal::where('id', $purchase->deal_id)->unsearchable();
    }

    /**
     * Handle the purchase "updated" event.
     *
     * @param  \App\Purchase  $purchase
     * @return void
     */
    public function updated(Purchase $purchase)
    {
        //
    }

    /**
     * Handle the purchase "deleted" event.
     *
     * @param  \App\Purchase  $purchase
     * @return void
     */
    public function deleted(Purchase $purchase)
    {
        //
    }
}
