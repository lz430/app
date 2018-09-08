<?php

namespace App\Observers;

use App\Models\Purchase;
use App\Models\Deal;

class PurchaseObserver
{
    /**
     * Handle to the purchase "created" event.
     *
     * @param \App\Models\Purchase $purchase
     * @return void
     */
    public function created(Purchase $purchase)
    {
        Deal::where('id', $purchase->deal_id)->searchable();
    }
}
