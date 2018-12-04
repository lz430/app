import Pricing from './Pricing';
import { fromDollarsAndCents, fromWholeDollars, zero } from '../money';
import { indexOf } from 'ramda';
import { getClosestNumberInRange } from '../../../util/util';

const defaultTerm = 36;
const defaultAnnualMileage = 10000;

const maxNumberOfTermsInMatrix = 4;
const maxNumberOfAnnualMileageOptionsInMatrix = 4;
const annualMileageOptionsMustBeMoreThan = 7500; // miles

export default class LeasePricing extends Pricing {
    basePrice = () =>
        this.discountedPrice()
            .add(this.docFee())
            .add(this.cvrFee())
            .add(this.tradeIn().owed)
            .subtract(this.tradeIn().value);

    sellingPrice = () => this.withTaxAdded(this.basePrice());

    yourPrice = () => this.sellingPrice().subtract(this.rebates());

    docFeeWithTaxes = () => this.withTaxAdded(this.docFee());
    cvrFeeWithTaxes = () => this.withTaxAdded(this.cvrFee());
    taxOnRebates = () => this.taxesFor(this.rebates());
    cashDownCCR = () => this.paymentDinero(payment => payment.cashDownCCR);

    totalAmountAtDriveOff = () => {
        return this.paymentDinero(payment => payment.totalAmountAtDriveOff).add(
            this.cashDownCCR()
        );
    };

    monthlyPayment = () =>
        this.paymentDinero(payment => payment.monthlyPayment);
    monthlyPreTaxPayment = () =>
        this.paymentDinero(payment => payment.monthlyPreTaxPayment);
    monthlyUseTax = () => this.paymentDinero(payment => payment.monthlyUseTax);

    // This implementation may change, but for now,
    // the first payment is going to be the same
    // value as the monthly payment.
    firstPayment = () => this.monthlyPayment();

    term = () => {
        if (!this.data.leaseTerm) {
            return this.calculateDefaultTerm();
        }

        return this.data.leaseTerm;
    };

    annualMileage = () => {
        if (!this.data.leaseAnnualMileage) {
            return this.calculateDefaultAnnualMileage();
        }

        return this.data.leaseAnnualMileage;
    };

    calculateCashDue = cashDuePercent => {
        const calculatedDownPayment = this.yourPrice()
            .multiply(cashDuePercent)
            .toRoundedUnit(0);

        return fromWholeDollars(calculatedDownPayment);
    };

    cashDue = () => {
        if (!this.data.leaseCashDue) {
            return zero;
        }

        return fromDollarsAndCents(this.data.leaseCashDue);
    };

    cashDuePercent = () => {
        const downPayment = this.cashDue().toRoundedUnit(0);
        if (!downPayment) {
            return zero.toRoundedUnit(0);
        }
        const price = this.yourPrice().toRoundedUnit(0);
        return Math.round((downPayment / price) * 100);
    };

    canPurchase = () => {
        return this.quoteIsLoaded() && this.payment();
    };

    termsAvailable = () => {
        const payments = this.payments();

        if (!payments) {
            return null;
        }

        return Object.keys(payments)
            .map(item => parseInt(item, 10))
            .sort((a, b) => a - b)
            .filter((term, termIndex) => termIndex < maxNumberOfTermsInMatrix);
    };

    paymentsForTermAndMileage = (term, annualMileage) => {
        const payments = this.payments();

        if (!payments) {
            return null;
        }

        if (!payments[term]) {
            return null;
        }

        if (!payments[term]) {
            return null;
        }

        if (!payments[term][annualMileage]) {
            return null;
        }

        return fromDollarsAndCents(
            payments[term][annualMileage].monthlyPayment
        );
    };

    payments = () => {
        if (this.data.dealQuote && this.data.dealQuote.payments) {
            return this.data.dealQuote.payments;
        }

        return null;
    };

    payment = () => {
        const payments = this.payments();

        if (!payments) {
            return null;
        }

        if (!payments[this.term()]) {
            return null;
        }

        if (!payments[this.term()][this.annualMileage()]) {
            return null;
        }

        return payments[this.term()][this.annualMileage()];
    };

    annualMileageAvailable = () => {
        const payments = this.payments();

        if (!payments) {
            return [];
        }

        const annualMileageOptions = [];

        for (let term of Object.keys(payments)) {
            for (let annualMileage of Object.keys(payments[term])) {
                if (indexOf(annualMileage, annualMileageOptions) !== -1) {
                    continue;
                }

                annualMileageOptions.push(annualMileage);
            }
        }

        return annualMileageOptions
            .map(item => parseInt(item, 10))
            .sort((a, b) => a - b)
            .filter(
                annualMiles => annualMiles > annualMileageOptionsMustBeMoreThan
            )
            .filter(
                (annualMiles, annualMilesIndex) =>
                    annualMilesIndex < maxNumberOfAnnualMileageOptionsInMatrix
            );
    };

    isSelectedLeasePaymentForTermAndMileage(term, annualMileage) {
        if (term !== this.term()) {
            return false;
        }

        return annualMileage === this.annualMileage();
    }

    calculateDefaultTerm = () => {
        const termsAvailable = this.termsAvailable();

        if (!termsAvailable || termsAvailable.length === 0) {
            return null;
        }

        if (termsAvailable.includes(defaultTerm)) {
            return defaultTerm;
        }

        return getClosestNumberInRange(36, termsAvailable);
    };

    calculateDefaultAnnualMileage = () => {
        const annualMileageAvailable = this.annualMileageAvailable();

        if (!annualMileageAvailable || annualMileageAvailable.length === 0) {
            return null;
        }

        if (annualMileageAvailable.includes(defaultAnnualMileage)) {
            return defaultAnnualMileage;
        }

        // Return the first lease annual mileage available.
        return annualMileageAvailable[0];
    };

    paymentDinero = fn => {
        const payment = this.payment();

        if (!payment) {
            return zero;
        }

        return fromDollarsAndCents(fn(payment));
    };
}
