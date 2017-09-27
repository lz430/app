import Decimal from 'decimal.js';

const formulas = {
    calculateTotalCashFinance: (price, docFee, rebatesTotal) => {
        const total = new Decimal(price).plus(docFee);
        const totalWithSalesTax = total.plus(total.times(0.06));

        return Number(totalWithSalesTax.minus(rebatesTotal));
    },
    calculateTotalLease: (price, docFee, rebatesTotal) => {
        const total = price + docFee;
        const downPayment = 0;
        const capCostReduction = new Decimal(rebatesTotal + downPayment);

        const taxOnCapCostReduction = capCostReduction.times(0.06);
        const taxOnDocFee = new Decimal(docFee).times(0.06);
        const totalTaxesDueAtSigning = taxOnCapCostReduction.plus(taxOnDocFee);

        return Number(totalTaxesDueAtSigning.plus(total));
    },
    calculateSalesTaxCashFinance: (price, docFee) => {
        const total = new Decimal(price).plus(docFee);

        return Number(total.times(0.06));
    },
    calculateLeaseTaxesDueAtSigning: (rebates, downPayment, docFee) => {
        const capCostReduction = new Decimal(rebates).plus(downPayment);

        return Number(
            capCostReduction.times(0.06).plus(new Decimal(docFee).times(0.06))
        );
    },
    /**
     * Total payment including use tax.
     */
    calculateTotalLeaseMonthlyPayment: paymentAmount => {
        return Math.round(
            Number(
                new Decimal(paymentAmount).plus(
                    new Decimal(paymentAmount).times(0.06)
                )
            )
        );
    },
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

        return Math.round(
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
        term,
        residualPercent
    ) => {
        const interestRate = 4;
        const capitalizedCost = price + deliveryCost - downPayment;
        const jatoResidualValue = residualPercent * 0.01;
        const depreciation =
            (capitalizedCost - capitalizedCost * jatoResidualValue) / term;
        const interest =
            (capitalizedCost + capitalizedCost * jatoResidualValue) *
            (interestRate / 2400);

        return Math.round(
            formulas.calculateTotalLeaseMonthlyPayment(depreciation + interest)
        );
    },
};

export default formulas;
