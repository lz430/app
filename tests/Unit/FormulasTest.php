<?php

namespace Tests\Unit;

use DeliverMyRide\Formulas;
use Tests\TestCase;

class FormulasTest extends TestCase
{
    /** @test */
    public function calculates_financed_monthly_payment_via_jato_formula()
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
}
