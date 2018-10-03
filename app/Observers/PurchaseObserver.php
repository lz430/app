<?php

namespace App\Observers;

use App\Models\Order\Purchase;
use App\Models\Deal;

class PurchaseObserver
{
    /**
     * Handle to the purchase "created" event.
     *
     * @param \App\Models\Order\Purchase $purchase
     * @return void
     */
    public function created(Purchase $purchase)
    {
        Deal::where('id', $purchase->deal_id)->searchable();
    }
}
