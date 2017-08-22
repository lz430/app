<?php

namespace DeliverMyRide;

class Formulas
{
    /** % */
    const INTEREST_RATE = 4;

    /**
     * Formula: EMI = ( P × r × (1+r)n ) / ((1+r)n − 1)
     * EMI = Equated Monthly Installment
     * P = Loan Amount - Down payment
     * r = Annual Interest rate / 1200
     * n = Term (Period or no.of year or months for loan repayment.)
     * @param $price
     * @param $downPayment
     * @param $term
     * @return float|int
     */
    public static function calculateFinancedMonthlyPayments($price, $downPayment, $term)
    {
        $EMI = (($price - $downPayment))
                * ((self::INTEREST_RATE / 1200) * (pow(1 + (self::INTEREST_RATE / 1200), $term)))
            / ((pow(1 + (self::INTEREST_RATE / 1200), $term)) - 1);

        return $EMI;
    }
}
