<?php

namespace App\Observers;

use App\Models\Deal;
use App\Models\Dealer;

class DealerObserver
{
    /**
     * Handle to the dealer "created" event.
     *
     * @param Dealer $dealer
     * @return void
     */
    public function created(Dealer $dealer)
    {
        Deal::where('dealer_id', $dealer->dealer_id)->searchable();
    }

    /**
     * Handle the dealer "updated" event.
     *
     * @param Dealer $dealer
     * @return void
     */
    public function updated(Dealer $dealer)
    {
        Deal::where('dealer_id', $dealer->dealer_id)->searchable();

        $originalPricing = $dealer->getOriginal()['price_rules'];
        $pricing = json_encode($dealer->price_rules);

        // Only update if is not new, and pricing is different.
        if ($originalPricing != $pricing) {
            $calculator = resolve('App\Services\Quote\DealBuildBasicPayments');
            foreach ($dealer->deals()->get() as $deal) {
                $calculator->calculateBasicPayments($deal);
            }
        }
    }
}
