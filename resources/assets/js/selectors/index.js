import { createSelector } from 'reselect';
import R from 'ramda';

const selectedDeal = state => state.selectedDeal;
const zipcode = state => state.zipcode;
const deal = (state, props) => props.deal;
const targetsAvailable = state => state.targetsAvailable;
const targetsSelected = state => state.targetsSelected;
const bestOffers = state => state.bestOffers;
const paymentType = state => state.selectedTab;
const targetDefaults = state => state.targetDefaults;
const employeeBrand = state =>
    state.employeeBrand === false ? null : state.employeeBrand;

const financeDownPayment = state => state.financeDownPayment;
const financeTerm = state => state.financeTerm;

const leaseAnnualMileage = state => state.leaseAnnualMileage;
const leaseTerm = state => state.leaseTerm;
const leaseCashDue = state => state.leaseCashDue;

const dealsIdsWithCustomizedQuotes = state =>
    state.dealsIdsWithCustomizedQuotes;

export const makeSelectedDeal = () => {
    return selectedDeal;
};

// Generate the target key for a specific deal
const dealTargetKey = createSelector([deal, zipcode], (deal, zipcode) => {
    if (!deal) {
        return null;
    }
    const vehicleId = deal.version.jato_vehicle_id;
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

const leaseRatesLoaded = state => state.leaseRatesLoaded;
const leaseRates = state => state.leaseRates;
const leasePaymentsLoaded = state => state.leasePaymentsLoaded;
const leasePayments = state => state.leasePayments;

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

const dealPricing = createSelector(
    deal,
    dealBestOffer,
    dealBestOfferLoading,
    zipcode,
    paymentType,
    employeeBrand,
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
    (
        deal,
        dealBestOffer,
        dealBestOfferLoading,
        zipcode,
        paymentType,
        employeeBrand,
        financeDownPaymentment,
        financeTerm,
        dealLeaseAnnualMileage,
        dealLeaseTerm,
        dealLeaseCashDue,
        dealHasCustomizedQuote,
        dealLeaseRatesLoading,
        dealLeaseRates,
        dealLeasePaymentsLoading,
        dealLeasePayments
    ) => {
        return {
            deal,
            bestOffer: dealBestOffer,
            bestOfferIsLoading: dealBestOfferLoading,
            zipcode,
            paymentType,
            employeeBrand,
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
        };
    }
);

export const makeDealPricing = () => {
    return dealPricing;
};
