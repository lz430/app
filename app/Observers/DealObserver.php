<?php

namespace App\Observers;

use App\Models\Deal;

class DealObserver
{
    /**
     * Handle to the deal "created" event.
     *
     * @param Deal $deal
     * @return void
     */
    public function created(Deal $deal)
    {
        $calculator = resolve('App\Services\Quote\DealCalculateBasicPayments');
        $calculator->calculateBasicPayments($deal);
    }

    /**
     * Handle the deal "updated" event.
     *
     * @param Deal $deal
     * @return void
     */
    public function saving(Deal $deal)
    {
        $originalPricing = $deal->getOriginal()['source_price'];
        $pricing = json_encode($deal->source_price);

        // Only update if is not new, and pricing is different.
        if (!$originalPricing != $pricing && isset($deal->id) && $deal->id) {
            $calculator = resolve('App\Services\Quote\DealCalculateBasicPayments');
            $calculator->calculateBasicPayments($deal, false);
        }
    }

}
