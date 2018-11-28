<?php

namespace App\Services\Quote;

use App\Models\Deal;

class DealCalculatePayments
{
    /**
     * @param Deal $deal
     * @param string $role
     * @param int $rebate
     * @return object
     */
    public static function cash(Deal $deal, string $role, int $rebate = 0)
    {
        $payment = $deal->prices()->{$role};
        $payment -= $rebate;

        return (object) [
            'down' => 0,
            'payment' => round($payment, 2),
        ];
    }

    /**
     * @param Deal $deal
     * @param string $role
     * @param int $term
     * @param float $rate
     * @param float $rebate
     * @return object
     */
    public static function finance(Deal $deal, string $role, int $term, float $rate, float $rebate = 0)
    {
        $michiganSalesTax = 0.06;
        $downPaymentPercent = 0.1;

        $price = $deal->prices()->{$role};
        $price += $deal->dealer->doc_fee;
        $price += $deal->dealer->cvr_fee;

        // MI Sales Tax
        $price += $price * $michiganSalesTax;
        $price -= $rebate;

        $down = $price * $downPaymentPercent;
        $annualInterestRate = $rate / 1200;
        $payment = $price - $down;
        $top = pow(1 + $annualInterestRate, $term);
        $bottom = $top - 1;
        $payment = $payment * $annualInterestRate * ($top / $bottom);

        return (object) [
            'down' => round($down, 2),
            'payment' => round($payment, 2),
        ];
    }
}
