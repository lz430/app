<?php

namespace App\Observers;

use App\Models\Order\Purchase;
use App\Models\Deal;

class PurchaseObserver
{
    /**
     * @param Purchase $purchase
     */
    private function onCreatedSyncWithHubspot(Purchase $purchase)
    {
        $hubSpotManager = resolve('DeliverMyRide\HubSpot\Manager\SyncPurchaseWithHubspot');
        $hubSpotManager->createContactAndDeal($purchase);
        $hubSpotManager->submitPurchaseForm($purchase);
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

            //
            // Remove deal from index
            Deal::where('id', $purchase->deal_id)->searchable();
        }
    }
}
