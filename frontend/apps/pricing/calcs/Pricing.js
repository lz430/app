import { zero, fromWholeDollars } from '../money';

/**
 *
 */
export default class Pricing {
    constructor(data) {
        this.data = data;
    }

    toData = () => this.data;

    id = () => this.data.deal.id;
    make = () => this.data.deal.make;
    deal = () => this.data.deal;

    isCash = () => this.data.paymentType === 'cash';
    isFinance = () => this.data.paymentType === 'finance';
    isLease = () => this.data.paymentType === 'lease';

    msrp = () => fromWholeDollars(this.data.deal.pricing.msrp);

    tradeIn = () => {
        return {
            owed: fromWholeDollars(this.data.tradeIn.owed),
            value: fromWholeDollars(this.data.tradeIn.value),
            estimate: this.data.tradeIn.estimate,
        };
    };

    quote = () => this.data.dealQuote;
    quoteIsLoading = () => this.data.dealQuoteIsLoading;
    quoteIsLoaded = () => !this.data.dealQuoteIsLoading;

    /**
     * @deprecated
     */
    rebate = () => this.rebates();

    rebates = () => {
        if (this.data.dealQuote && this.data.dealQuote.rebates) {
            return fromWholeDollars(this.data.dealQuote.rebates.total);
        }

        return zero;
    };

    canPurchase = () => {
        return this.quoteIsLoaded();
    };

    hasRebatesApplied = () => !this.rebates().isZero();

    taxRate = () => 0.06;

    docFee = () => fromWholeDollars(this.data.deal.doc_fee);
    cvrFee = () => fromWholeDollars(this.data.deal.cvr_fee);

    defaultPrice = () => fromWholeDollars(this.data.deal.pricing.default);
    employeePrice = () => fromWholeDollars(this.data.deal.pricing.employee);
    supplierPrice = () => fromWholeDollars(this.data.deal.pricing.supplier);

    discountedPrice = () => {
        if (this.isEffectiveDiscountEmployee()) {
            return this.employeePrice();
        }

        if (this.isEffectiveDiscountSupplier()) {
            return this.supplierPrice();
        }

        if (this.isEffectiveDiscountDmr()) {
            return this.defaultPrice();
        }

        return this.msrp();
    };

    discount = () => this.msrp().subtract(this.discountedPrice());

    dmrDiscount = () => this.msrp().subtract(this.defaultPrice());
    employeeDiscount = () => this.msrp().subtract(this.employeePrice());
    supplierDiscount = () => this.msrp().subtract(this.supplierPrice());

    discountType = () => {
        if (this.isEffectiveDiscountDmr()) {
            return 'dmr';
        }

        if (this.isEffectiveDiscountEmployee()) {
            return 'employee';
        }

        if (this.isEffectiveDiscountSupplier()) {
            return 'supplier';
        }

        return 'dmr';
    };

    isEffectiveDiscountEmployee = () => {
        return (
            this.data.discountType === 'employee' &&
            this.data.employeeBrand === this.data.deal.make
        );
    };

    isEffectiveDiscountSupplier = () => {
        return (
            this.data.discountType === 'supplier' &&
            this.data.supplierBrand === this.data.deal.make
        );
    };

    isEffectiveDiscountDmr = () => {
        if (!this.data.discountType || this.data.discountType === 'dmr') {
            return true;
        }

        if (
            this.data.discountType === 'employee' &&
            this.data.employeeBrand !== this.data.deal.make
        ) {
            return true;
        }

        return (
            this.data.discountType === 'supplier' &&
            this.data.supplierBrand !== this.data.deal.make
        );
    };

    withTaxAdded = amount => amount.add(this.taxesFor(amount));
    taxesFor = amount => amount.multiply(this.taxRate());

    toCheckoutData = () => ({
        deal: this.data.deal,
        quote: this.quote(),
        paymentStrategy: this.data.paymentType,
        discountType: this.discountType(),
        effectiveTerm: this.callMethodOrNull('term'),
        financeDownPayment: this.callMethodOrNull('downPayment', v =>
            parseInt(v.toFormat('0.00'))
        ),
        leaseAnnualMileage: this.callMethodOrNull('annualMileage'),
        employeeBrand: this.data.employeeBrand,
        supplierBrand: this.data.supplierBrand,
    });

    callMethodOrNull = (fn, after = v => v) =>
        typeof this[fn] === 'function' ? after(this[fn]()) : null;
}
