import R from 'ramda';

const formulas = {
    /**
     * Formula: EMI = ( P × r × (1+r)n ) / ((1+r)n − 1)
     * EMI = Equated Monthly Installment
     * P = Loan Amount - Down payment
     * r = Annual Interest rate / 1200
     * n = Term (Period or no.of year or months for loan repayment.)
     * @param price
     * @param downPayment
     * @param term
     * @return float|int
     */
    calculateFinancedMonthlyPayments: (price, downPayment, term) => {
        const interestRate = 4;

        return (
            (price - downPayment) *
            (interestRate /
                1200 *
                Math.pow(1 + interestRate / 1200, term) /
                (Math.pow(1 + interestRate / 1200, term) - 1))
        );
    },

    calculateLeasedMonthlyPayments: (
        price,
        downPayment,
        deliveryCost,
        term
    ) => {
        const interestRate = 4;
        const capitalizedCost = price + deliveryCost - downPayment;
        const jatoResidualValue = 0.61;
        const depreciation =
            (capitalizedCost - capitalizedCost * jatoResidualValue) / term;
        const interest =
            (capitalizedCost + capitalizedCost * jatoResidualValue) *
            (interestRate / 2400);

        return depreciation + interest;
    },
};

export default formulas;