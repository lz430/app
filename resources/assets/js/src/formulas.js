import Decimal from 'decimal.js';

const defaultEffCvrFee = 24;
const defaultLicenseAndRegistration = 23;

const formulas = {
    /**
     *
     * @param price
     * @param docFee
     * @param rebatesTotal
     * @returns {number}
     */
    calculateTotalCash: (price, docFee, rebatesTotal) => {
        const total = new Decimal(price).plus(docFee).plus(defaultEffCvrFee);
        const totalWithSalesTax = total.plus(total.times(0.06));

        return Number(
            totalWithSalesTax
                .minus(rebatesTotal)
                .plus(defaultLicenseAndRegistration)
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
                (((interestRate / 1200) *
                    Math.pow(1 + interestRate / 1200, term)) /
                    (Math.pow(1 + interestRate / 1200, term) - 1))
        );
    },
};

export default formulas;
