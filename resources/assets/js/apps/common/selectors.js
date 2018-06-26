import { createSelector } from 'reselect';
import R from 'ramda';

export default state => state.common;
export const common = state => state.common;

const selectedDeal = state => state.common.selectedDeal;
const zipcode = state => state.user.location.zipcode;
const deal = (state, props) => props.deal;
const targetsAvailable = state => state.common.targetsAvailable;
const targetsSelected = state => state.common.targetsSelected;

const bestOffers = state => {
    if (state.common) {
        return state.common.bestOffers;
    } else {
        return state.bestOffers;
    }
};
const paymentType = state => state.user.purchasePreferences.strategy;
const targetDefaults = state => state.common.targetDefaults;
const employeeBrand = state => {
    return state.pages.dealDetails.selectDiscount.employeeBrand === false
        ? null
        : state.pages.dealDetails.selectDiscount.employeeBrand;
};
const supplierBrand = state =>
    state.pages.dealDetails.selectDiscount.supplierBrand === false
        ? null
        : state.pages.dealDetails.selectDiscount.supplierBrand;
const discountType = state =>
    state.pages.dealDetails.selectDiscount.discountType;

const financeDownPayment = state => state.pages.dealDetails.finance.downPayment;
const financeTerm = state => state.pages.dealDetails.finance.term;

const leaseAnnualMileage = state => state.pages.dealDetails.lease.annualMileage;
const leaseTerm = state => state.pages.dealDetails.lease.term;
const leaseCashDue = state => state.pages.dealDetails.lease.cashDue;

const dealsIdsWithCustomizedQuotes = state =>
    state.common.dealsIdsWithCustomizedQuotes;

export const makeSelectedDeal = () => {
    return selectedDeal;
};

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

// Show me all selected targets for a specific deal
const dealTargetsSelected = createSelector(
    [dealTargetKey, targetsSelected],
    (dealTargetKey, targetsSelected) => {
        return R.prop(dealTargetKey, targetsSelected) || [];
    }
);

export const makeDealTargetsSelected = () => {
    return dealTargetsSelected;
};

// Generate a string of unique target ids joined by '-'
// This will be used to cache best offers on the front-end
const selectedTargetsString = createSelector(
    [dealTargetsSelected, targetDefaults],
    (dealTargetsSelected, targetDefaults) => {
        const selectedTargetIds =
            R.map(R.prop('targetId'), dealTargetsSelected) || [];
        const uniqueSelectedTargetIds = R.uniq(
            R.concat(targetDefaults, selectedTargetIds)
        );
        return R.sort((a, b) => {
            return a - b;
        }, uniqueSelectedTargetIds).join('-');
    }
);

// Generate the best offer key for a specific deal
const dealBestOfferKey = createSelector(
    [deal, zipcode, paymentType, selectedTargetsString],
    (deal, zipcode, paymentType, selectedTargetsString) => {
        if (!deal) {
            return null;
        }
        return `${deal.id}-${zipcode}-${paymentType}-${selectedTargetsString}`;
    }
);

export const makeDealBestOfferKey = () => {
    return dealBestOfferKey;
};

const dealBestOfferLoading = createSelector(
    [bestOffers, dealBestOfferKey],
    (bestOffers, dealBestOfferKey) => {
        return R.isNil(R.prop(dealBestOfferKey, bestOffers));
    }
);

export const makeDealBestOfferLoading = () => {
    return dealBestOfferLoading;
};

const emptyBestOffer = { totalValue: 0, programs: [] };

// Show me the best offer for a specific deal or default to no best offer
const dealBestOffer = createSelector(
    [bestOffers, dealBestOfferKey],
    (bestOffers, dealBestOfferKey) => {
        return R.prop(dealBestOfferKey, bestOffers) || emptyBestOffer;
    }
);

export const makeDealBestOffer = () => {
    return dealBestOffer;
};

// Get the total value of the best offer for the deal
const dealBestOfferTotalValue = createSelector(
    [dealBestOffer],
    dealBestOffer => {
        return R.prop('totalValue', dealBestOffer) || 0;
    }
);

export const makeDealBestOfferTotalValue = () => {
    return dealBestOfferTotalValue;
};

const dealHasCustomizedQuote = createSelector(
    deal,
    dealsIdsWithCustomizedQuotes,
    (deal, dealsIdsWithCustomizedQuotes) => {
        return R.contains(deal.id, dealsIdsWithCustomizedQuotes);
    }
);

const dealLeaseRatesKey = createSelector([deal, zipcode], (deal, zipcode) => {
    if (!deal) {
        return null;
    }
    return `${deal.id}.${zipcode}`;
});

const dealLeasePaymentsKey = createSelector(
    [deal, zipcode],
    (deal, zipcode) => {
        if (!deal) {
            return null;
        }
        return `${deal.id}.${zipcode}`;
    }
);

export const makeDealLeasePaymentsKey = () => {
    return dealLeasePaymentsKey;
};

const leaseRatesLoaded = state => state.common.leaseRatesLoaded;
const leaseRates = state => state.common.leaseRates;
const leasePaymentsLoaded = state => state.common.leasePaymentsLoaded;
const leasePayments = state => state.common.leasePayments;

const dealLeaseRatesLoading = createSelector(
    leaseRatesLoaded,
    dealLeaseRatesKey,
    (leaseRatesLoaded, dealLeaseRatesKey) =>
        R.isNil(R.prop(dealLeaseRatesKey, leaseRatesLoaded))
);

const dealLeaseRates = createSelector(
    leaseRates,
    dealLeaseRatesKey,
    (leaseRates, dealLeaseRatesKey) =>
        leaseRates && leaseRates[dealLeaseRatesKey]
            ? leaseRates[dealLeaseRatesKey]
            : []
);

const dealLeasePaymentsLoading = createSelector(
    leasePaymentsLoaded,
    dealLeasePaymentsKey,
    (leasePaymentsLoaded, dealLeasePaymentsKey) =>
        R.isNil(R.prop(dealLeasePaymentsKey, leasePaymentsLoaded))
);

const dealLeasePayments = createSelector(
    leasePayments,
    dealLeasePaymentsKey,
    (leasePayments, dealLeasePaymentsKey) =>
        leasePayments && leasePayments[dealLeasePaymentsKey]
            ? leasePayments[dealLeasePaymentsKey]
            : {}
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
    [deal, zipcode, paymentType],
    (deal, zipcode, paymentType) => {
        if (!deal || !zipcode || !paymentType) {
            return null;
        }

        return `${deal.id}-${paymentType}-${zipcode}`;
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

const dealQuoteIsLoading = createSelector([dealQuote], quote => {
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
        const data = {
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
        return data;
    }
);

export const makeDealPricing = () => {
    return dealPricing;
};
