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
        if (!this.data.tradeIn) {
            return {
                owed: zero,
                value: zero,
                estimate: null,
            };
        }
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

    hasPotentialConditionalRebates = () => {
        const quote = this.quote();
        return !!(
            quote &&
            quote.selections &&
            quote.selections.conditionalRoles &&
            Object.keys(quote.selections.conditionalRoles).length
        );
    };

    canPurchase = () => {
        return this.quoteIsLoaded();
    };

    hasRebatesApplied = () => !this.rebates().isZero();

    taxRate = () => 0.06;

    docFee = () => fromWholeDollars(this.data.deal.fees.doc);
    cvrFee = () => fromWholeDollars(this.data.deal.fees.cvr);

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

    discountedAndRebatedPrice = () =>
        this.discountedPrice().subtract(this.rebates());

    discountsAndRebatesValue = () =>
        this.msrp().subtract(this.discountedAndRebatedPrice());

    isEffectiveDiscountEmployee = () => {
        return this.data.discountType === 'employee';
    };

    isEffectiveDiscountSupplier = () => {
        return this.data.discountType === 'supplier';
    };

    isEffectiveDiscountDmr = () => {
        return !this.data.discountType || this.data.discountType === 'dmr';
    };

    withTaxAdded = amount => amount.add(this.taxesFor(amount));
    taxesFor = amount => amount.multiply(this.taxRate());

    toCheckoutData = () => ({
        deal: this.data.deal,
        quote: this.quote(),
        tradeIn: this.data.tradeIn,
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
