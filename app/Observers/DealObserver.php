<?php

namespace App\Observers;

use App\Models\Deal;
use Illuminate\Support\Facades\Cache;

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
     * Handle the deal "saving" event.
     *
     * @param Deal $deal
     * @return void
     */
    public function saving(Deal $deal)
    {
        $originalPricing = (isset($deal->getOriginal()['source_price']) ? $deal->getOriginal()['source_price'] : null);
        $pricing = json_encode($deal->source_price);

        // Only update if is not new, and pricing is different.
        if ($originalPricing !== null && $originalPricing != $pricing && isset($deal->id) && $deal->id) {
            $calculator = resolve('App\Services\Quote\DealCalculateBasicPayments');
            $calculator->calculateBasicPayments($deal, false);
        }
    }

    /**
     * Handle the deal "saving" event.
     *
     * @param Deal $deal
     * @return void
     */
    public function updated(Deal $deal)
    {
        $originalPricing = (isset($deal->getOriginal()['payments']) ? $deal->getOriginal()['payments'] : null);
        $payments = json_encode($deal->payments);

        // Only update if is not new, and payments is different.
        if ($originalPricing !== null && $originalPricing != $payments && isset($deal->id) && $deal->id) {
            Cache::tags('deal-' . $deal->id)->flush();
        }
    }
}