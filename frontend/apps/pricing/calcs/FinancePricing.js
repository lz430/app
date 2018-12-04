import Pricing from './Pricing';
import { fromWholeDollars, zero } from '../money';

const defaultTerm = 60;
const defaultDownPaymentPercent = 0.1; // example: .25 here means 25%
const maxDownPaymentPercent = 0.9; // example: .25 here means 25%
const annualInterestRate = 5;

/**
 *
 */
export default class FinancePricing extends Pricing {
    basePrice = () =>
        this.discountedPrice()
            .add(this.docFee())
            .add(this.cvrFee())
            .add(this.tradeIn().owed)
            .subtract(this.tradeIn().value);

    sellingPrice = () => this.withTaxAdded(this.basePrice());

    yourPrice = () => this.sellingPrice().subtract(this.rebates());

    salesTax = () =>
        this.discountedPrice()
            .add(this.docFee())
            .add(this.cvrFee())
            .multiply(this.taxRate());

    taxesAndFees = () =>
        zero
            .add(this.docFee())
            .add(this.cvrFee())
            .add(this.salesTax());

    calculateDownPayment = downPaymentPercent => {
        const calculatedDownPayment = this.yourPrice()
            .multiply(downPaymentPercent)
            .toRoundedUnit(0);

        return fromWholeDollars(calculatedDownPayment);
    };

    downPayment = () => {
        const downPayment = this.data.financeDownPayment;

        if (downPayment === null || downPayment === undefined) {
            return this.calculateDownPayment(defaultDownPaymentPercent);
        }

        return fromWholeDollars(downPayment);
    };

    downPaymentPercent = () => {
        const downPayment = this.downPayment().toRoundedUnit(0);
        if (!downPayment) {
            return zero.toRoundedUnit(0);
        }

        const price = this.yourPrice().toRoundedUnit(0);

        console.log('downPaymentPercent');
        console.log(downPayment);
        return Math.round((downPayment / price) * 100);
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
        const P = this.yourPrice().subtract(this.downPayment());
        const r = annualInterestRate / 1200;
        const n = this.term();

        const onePlusRtoThePowerOfN = Math.pow(1 + r, n);

        return P.multiply(r)
            .multiply(onePlusRtoThePowerOfN)
            .divide(onePlusRtoThePowerOfN - 1);
    };
}
