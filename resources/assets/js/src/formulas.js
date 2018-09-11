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
        const annualInterestRate = interestRate / 1200;
        return Math.round(
            (price - downPayment) *
                ((annualInterestRate * Math.pow(1 + annualInterestRate, term)) /
                    (Math.pow(1 + annualInterestRate, term) - 1))
        );
    },
};

export default formulas;
