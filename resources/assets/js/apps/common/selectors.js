import { createSelector } from 'reselect';
import R from 'ramda';
import { dealQuoteKey as generateDealQuoteKey } from 'apps/pricing/helpers';

export default state => state.common;
export const common = state => state.common;

export const zipcode = state => state.user.location.zipcode;
export const deal = (state, props) => props.deal;

const paymentType = state => state.user.purchasePreferences.strategy;

const employeeBrand = state => {
    return state.pages.dealDetails.selectDiscount.employeeBrand === false
        ? null
        : state.pages.dealDetails.selectDiscount.employeeBrand;
};
const supplierBrand = state =>
    state.pages.dealDetails.selectDiscount.supplierBrand === false
        ? null
        : state.pages.dealDetails.selectDiscount.supplierBrand;

export const discountType = state =>
    state.pages.dealDetails.selectDiscount.discountType;

const financeDownPayment = state => state.pages.dealDetails.finance.downPayment;
const financeTerm = state => state.pages.dealDetails.finance.term;

const leaseAnnualMileage = state => state.pages.dealDetails.lease.annualMileage;
const leaseTerm = state => state.pages.dealDetails.lease.term;
const leaseCashDue = state => state.pages.dealDetails.lease.cashDue;

const dealsIdsWithCustomizedQuotes = state =>
    state.common.dealsIdsWithCustomizedQuotes;

const dealHasCustomizedQuote = createSelector(
    deal,
    dealsIdsWithCustomizedQuotes,
    (deal, dealsIdsWithCustomizedQuotes) => {
        return R.contains(deal.id, dealsIdsWithCustomizedQuotes);
    }
);

const dealLeaseAnnualMileage = createSelector(
    leaseAnnualMileage,
    leaseAnnualMileage => {
        return leaseAnnualMileage;
    }
);

const dealLeaseTerm = createSelector(leaseTerm, leaseTerm => {
    return leaseTerm;
});

const dealLeaseCashDue = createSelector(leaseCashDue, leaseCashDue => {
    return leaseCashDue;
});

const quotes = state => {
    return state.pricing.quotes;
};

const dealQuoteKey = createSelector(
    [deal, zipcode, paymentType, discountType],
    (deal, zipcode, paymentType, discountType) => {
        if (!deal || !zipcode || !paymentType) {
            return null;
        }
        let role = 'default';

        if (discountType === 'dmr' || !discountType) {
            role = 'default';
        } else {
            role = discountType;
        }

        return generateDealQuoteKey(deal, zipcode, paymentType, role);
    }
);

const dealQuote = createSelector(
    [quotes, dealQuoteKey],
    (quotes, dealQuoteKey) => {
        return R.prop(dealQuoteKey, quotes) || null;
    }
);

export const dealQuoteRebatesTotal = createSelector([dealQuote], quote => {
    if (quote && quote.rebates) {
        return quote.rebates.total || 0;
    }
    return 0;
});

export const dealQuoteIsLoading = createSelector([dealQuote], quote => {
    return quote === null;
});

export const dealPricingData = createSelector(
    deal,
    paymentType,
    employeeBrand,
    supplierBrand,
    financeDownPayment,
    financeTerm,
    dealLeaseAnnualMileage,
    dealLeaseTerm,
    dealLeaseCashDue,
    dealHasCustomizedQuote,
    discountType,
    dealQuoteIsLoading,
    dealQuote,
    (
        deal,
        paymentType,
        employeeBrand,
        supplierBrand,
        financeDownPayment,
        financeTerm,
        dealLeaseAnnualMileage,
        dealLeaseTerm,
        dealLeaseCashDue,
        dealHasCustomizedQuote,
        discountType,
        dealQuoteIsLoading,
        dealQuote
    ) => {
        return {
            deal,
            paymentType,
            employeeBrand,
            supplierBrand,
            financeDownPayment,
            financeTerm,
            leaseAnnualMileage: dealLeaseAnnualMileage,
            leaseTerm: dealLeaseTerm,
            dealHasCustomizedQuote,
            discountType,
            dealQuoteIsLoading,
            dealQuote,
        };
    }
);
