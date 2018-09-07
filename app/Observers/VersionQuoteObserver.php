<?php

namespace App\Observers;

use App\Models\JATO\VersionQuote;
use Illuminate\Support\Facades\Cache;

class VersionQuoteObserver
{
    /**
     * Handle to the quote "created" event.
     *
     * @param VersionQuote $quote
     * @return void
     */
    public function created(VersionQuote $quote)
    {
        $calculator = resolve('App\Services\Quote\DealCalculateBasicPayments');
        foreach($quote->version->deals() as $deal) {
            $calculator->calculateBasicPayments($deal);
            Cache::tags('deal-' . $deal->id)->flush();
        }
    }

    /**
     * Handle the quote "updated" event.
     *
     * @param VersionQuote $quote
     * @return void
     */
    public function updated(VersionQuote $quote)
    {
        if ($quote->getOriginal()['hashcode'] != $quote->hashcode) {
            $calculator = resolve('App\Services\Quote\DealCalculateBasicPayments');
            foreach($quote->version->deals() as $deal) {
                if($deal->status == 'available') {
                    $calculator->calculateBasicPayments($deal);
                    Cache::tags('deal-' . $deal->id)->flush();
                }
            }
        }
    }

    /**
     * Handle the quote "deleted" event.
     *
     * @param VersionQuote $quote
     * @return void
     */
    public function deleted(VersionQuote $quote)
    {
        $calculator = resolve('App\Services\Quote\DealCalculateBasicPayments');
        foreach($quote->version->deals() as $deal) {
            $calculator->calculateBasicPayments($deal);
        }
    }
}
