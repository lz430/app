<?php

namespace App\Observers;

use App\Models\Order\Purchase;
use App\Models\Deal;
use Illuminate\Support\Facades\Notification;
use App\Notifications\NotifyToSlackChannel;

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
            // Notify Slack
            $data = [
                'title' => 'Purchase Data',
                'message' => "New Purchase Submission",
                'fields' => [
                    'Environment' => config('app.env'),
                    'Stock Number' => $purchase->deal->stock_number,
                    'VIN' => $purchase->deal->vin,
                    'Deal ID' => $purchase->deal_id,
                ]
            ];

            Notification::route('slack', config('services.slack.webhook'))
                ->notify(new NotifyToSlackChannel($data));

            //
            // Remove deal from index
            Deal::where('id', $purchase->deal_id)->searchable();
        }
    }
}
