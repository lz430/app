<?php

namespace App\Observers;

use App\Models\Order\Purchase;
use App\Models\Deal;
use App\Policies\PurchasePolicy;

class PurchaseObserver
{
    /**
     * @param Purchase $purchase
     */
    private function onCreatedSyncWithHubspot(Purchase $purchase)
    {
        $client = resolve('DeliverMyRide\HubSpot\HubspotClient');

        dd($contact);
    }

    /**
     * Handle to the purchase "created" event.
     *
     * @param \App\Models\Order\Purchase $purchase
     * @return void
     */
    public function created(Purchase $purchase)
    {
        //
        // Remove deal from index
        Deal::where('id', $purchase->deal_id)->searchable();

        //
        // Sync with hubspot
        $this->onCreatedSyncWithHubspot($purchase);
    }

    /**
     * Handle to the purchase "updated" event.
     *
     * @param \App\Models\Order\Purchase $purchase
     * @return void
     */
    public function updated(Purchase $purchase)
    {
        $originalStatus =$purchase->getOriginal()['status'];
        if ($originalStatus === 'cart' && $purchase->status === 'contact') {

            //
            // Sync with hubspot
            $this->onCreatedSyncWithHubspot($purchase);
        }


        //
        // Remove deal from index
        Deal::where('id', $purchase->deal_id)->searchable();
    }
}
