import { createSelector } from 'reselect';
import R from 'ramda';
import { dealQuoteKey as generateDealQuoteKey } from 'apps/pricing/helpers';

export default state => state.common;
export const common = state => state.common;

const zipcode = state => state.user.location.zipcode;
const deal = (state, props) => props.deal;
const targetsAvailable = state => state.common.targetsAvailable;

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

// Generate the target key for a specific deal
const dealTargetKey = createSelector([deal, zipcode], (deal, zipcode) => {
    if (!deal) {
        return null;
    }
    const vehicleId = deal.id;
    return `${vehicleId}-${zipcode}`;
});

export const makeDealTargetKey = () => {
    return dealTargetKey;
};

// Check if we already have the targets for this target id.
const dealTargetsAvailableLoading = createSelector(
    [dealTargetKey, targetsAvailable],
    (dealTargetKey, targetsAvailable) => {
        return R.isNil(R.prop(dealTargetKey, targetsAvailable));
    }
);

export const makeDealTargetsAvailableLoading = () => {
    return dealTargetsAvailableLoading;
};

// Show me all available targets for a specific deal
const dealTargetsAvailable = createSelector(
    [dealTargetKey, targetsAvailable],
    (dealTargetKey, targetsAvailable) => {
        return R.prop(dealTargetKey, targetsAvailable) || [];
    }
);

export const makeDealTargetsAvailable = () => {
    return dealTargetsAvailable;
};

const dealHasCustomizedQuote = createSelector(
    deal,
    dealsIdsWithCustomizedQuotes,
    (deal, dealsIdsWithCustomizedQuotes) => {
        return R.contains(deal.id, dealsIdsWithCustomizedQuotes);
    }
);

const dealLeaseAnnualMileage = createSelector(
    deal,
    zipcode,
    leaseAnnualMileage,
    (deal, zipcode, leaseAnnualMileage) => {
        const key = `${deal.id}.${zipcode}`;

        return leaseAnnualMileage[key] ? leaseAnnualMileage[key] : null;
    }
);

const dealLeaseTerm = createSelector(
    deal,
    zipcode,
    leaseTerm,
    (deal, zipcode, leaseTerm) => {
        const key = `${deal.id}.${zipcode}`;

        return leaseTerm[key] ? leaseTerm[key] : null;
    }
);

const dealLeaseCashDue = createSelector(
    deal,
    zipcode,
    leaseCashDue,
    (deal, zipcode, leaseCashDue) => {
        const key = `${deal.id}.${zipcode}`;

        return leaseCashDue[key] ? leaseCashDue[key] : null;
    }
);

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

const dealQuoteRebates = createSelector([dealQuote], quote => {
    if (quote && quote.rebates) {
        return quote.rebates;
    }
    return null;
});

export const dealQuoteRebatesTotal = createSelector([dealQuote], quote => {
    if (quote && quote.rebates) {
        return quote.rebates.total || 0;
    }
    return 0;
});

export const dealQuoteIsLoading = createSelector([dealQuote], quote => {
    return quote === null;
});

const dealQuoteLeaseRates = createSelector([dealQuote], quote => {
    if (quote && quote.rates) {
        return quote.rates;
    }
    return [];
});

const dealQuoteLeasePayments = createSelector([dealQuote], quote => {
    if (quote && quote.payments) {
        return quote.payments;
    }
    return [];
});

const dealPricing = createSelector(
    deal,
    dealQuoteRebates,
    dealQuoteIsLoading,
    zipcode,
    paymentType,
    employeeBrand,
    supplierBrand,
    financeDownPayment,
    financeTerm,
    dealLeaseAnnualMileage,
    dealLeaseTerm,
    dealLeaseCashDue,
    dealHasCustomizedQuote,
    dealQuoteIsLoading,
    dealQuoteLeaseRates,
    dealQuoteIsLoading,
    dealQuoteLeasePayments,
    discountType,
    (
        deal,
        dealRebates,
        dealBestOfferLoading,
        zipcode,
        paymentType,
        employeeBrand,
        supplierBrand,
        financeDownPayment,
        financeTerm,
        dealLeaseAnnualMileage,
        dealLeaseTerm,
        dealLeaseCashDue,
        dealHasCustomizedQuote,
        dealLeaseRatesLoading,
        dealLeaseRates,
        dealLeasePaymentsLoading,
        dealLeasePayments,
        discountType
    ) => {
        return {
            deal,
            bestOffer: dealRebates,
            bestOfferIsLoading: dealBestOfferLoading,
            zipcode,
            paymentType,
            employeeBrand,
            supplierBrand,
            financeDownPayment,
            financeTerm,
            leaseAnnualMileage: dealLeaseAnnualMileage,
            leaseTerm: dealLeaseTerm,
            leaseCashDue: dealLeaseCashDue,
            dealHasCustomizedQuote,
            dealLeaseRatesLoading,
            dealLeaseRates,
            dealLeasePaymentsLoading,
            dealLeasePayments,
            discountType,
        };
    }
);

export const makeDealPricing = () => {
    return dealPricing;
};
