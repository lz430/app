<?php

namespace Tests\Unit;

use DeliverMyRide\Formulas;
use Tests\TestCase;

class FormulasTest extends TestCase
{
    /** @test */
    public function calculates_monthly_finance_payment_via_basic_formula()
    {
        $price = 10000;
        $downPayment = 1000;
        /** months */
        $term = 12;

        $this->assertEquals(
            round(Formulas::calculateFinancedMonthlyPayments($price, $downPayment, $term)),
            766
        );
    }

    /** @test */
    public function calculates_monthly_lease_payment_via_jato_formula()
    {
        // calculateLeasedMonthlyPayments
        $price = 33150;
        /** months */
        $term = 24;
        $downPayment = 3414;
        $deliveryCost = 995;

        $this->assertEquals(
            round(Formulas::calculateLeasedMonthlyPayments(
                $price,
                $downPayment,
                $deliveryCost,
                $term
            )),
            582
        );
    }
}
