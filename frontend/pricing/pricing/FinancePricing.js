import Pricing from './Pricing';
import { fromWholeDollars } from '../money';

const defaultTerm = 60;
const defaultDownPaymentPercent = 0.1; // example: .25 here means 25%
const maxDownPaymentPercent = 0.9; // example: .25 here means 25%

/**
 *
 */
export default class FinancePricing extends Pricing {
    basePrice = () =>
        this.discountedPrice()
            .add(this.docFee())
            .add(this.cvrFee());

    sellingPrice = () => this.withTaxAdded(this.basePrice());
    yourPrice = () => this.sellingPrice().subtract(this.rebates());

    salesTax = () => this.taxesFor(this.basePrice());

    downPayment = () => {
        const downPayment = this.data.financeDownPayment;

        if (downPayment === null || downPayment === undefined) {
            const calculatedDownPayment = this.yourPrice()
                .multiply(defaultDownPaymentPercent)
                .toRoundedUnit(0);

            return fromWholeDollars(calculatedDownPayment);
        }

        return fromWholeDollars(downPayment);
    };

    maxDownPayment = () => this.yourPrice().multiply(maxDownPaymentPercent);

    amountFinanced = () => this.yourPrice().subtract(this.downPayment());

    term = () => {
        const term = this.data.financeTerm;
        if (term === null || term === undefined || term === 0) {
            return defaultTerm;
        }

        return term;
    };

    /**
     * Formula: EMI = ( P × r × (1+r)n ) / ((1+r)n − 1)
     * EMI = Equated Monthly Installment
     * P = Loan Amount - Down payment
     * r = Annual Interest rate / 1200
     * n = Term (Period or no.of year or months for loan repayment.)
     */
    monthlyPayment = () => {
        const annualInterestRate = 5;

        const P = this.yourPrice().subtract(this.downPayment());
        const r = annualInterestRate / 1200;
        const n = this.term();

        const onePlusRtoThePowerOfN = Math.pow(1 + r, n);

        return P.multiply(r)
            .multiply(onePlusRtoThePowerOfN)
            .divide(onePlusRtoThePowerOfN - 1);
    };
}
