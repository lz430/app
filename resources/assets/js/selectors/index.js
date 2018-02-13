import { createSelector } from 'reselect';
import { selectDeal } from '../actions/index';
import R from 'ramda';

const selectedDeal = state => state.selectedDeal;
const zipcode = state => state.zipcode;
const deal = (state, props) => props.deal;
const targetsAvailable = state => state.targetsAvailable;
const targetsSelected = state => state.targetsSelected;
const bestOffers = state => state.bestOffers;
const paymentType = state => state.selectedTab;
const targetDefaults = state => state.targetDefaults;

// Generate the target key for a specific deal
const dealTargetKey = createSelector(
    [deal, zipcode],
    (deal, zipcode) => {
        if(!deal) {
            return null;
        }
        const vehicleId = deal.versions[0].jato_vehicle_id;
        return `${vehicleId}-${zipcode}`;
    }
);

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
}

// Show me all available targets for a specific deal
const dealTargetsAvailable = createSelector(
    [dealTargetKey, targetsAvailable],
    (dealTargetKey, targetsAvailable) => {
        return R.prop(dealTargetKey, targetsAvailable) || [];
    }
);

export const makeDealTargetsAvailable = () => {
    return dealTargetsAvailable;
}

// Show me all selected targets for a specific deal
const dealTargetsSelected = createSelector(
    [dealTargetKey, targetsSelected],
    (dealTargetKey, targetsSelected) => {
        return R.prop(dealTargetKey, targetsSelected) || [];
    }
)

export const makeDealTargetsSelected = () => {
    return dealTargetsSelected;
}

// Generate a string of unique target ids joined by '-'
// This will be used to cache best offers on the front-end
const selectedTargetsString = createSelector(
    [dealTargetsSelected, targetDefaults],
    (dealTargetsSelected, targetDefaults) => {
        const selectedTargetIds = R.map(R.prop('targetId'), dealTargetsSelected) || [];
        const uniqueSelectedTargetIds = R.uniq(R.concat(targetDefaults, selectedTargetIds));
        return R.sort((a, b) => {
            return a - b;
        }, uniqueSelectedTargetIds).join('-');
    }
)

// Generate the best offer key for a specific deal
const dealBestOfferKey = createSelector(
    [deal, zipcode, paymentType, selectedTargetsString],
    (deal, zipcode, paymentType, selectedTargetsString) => {
        const vehicleId = deal.versions[0].jato_vehicle_id;
        return `${vehicleId}-${zipcode}-${paymentType}-${selectedTargetsString}`;
    }
);

export const makeDealBestOfferKey = () => {
    return dealBestOfferKey;
}

const dealBestOfferLoading = createSelector(
    [bestOffers, dealBestOfferKey],
    (bestOffers, dealBestOfferKey) => {
        return R.isNil(R.prop(dealBestOfferKey,  bestOffers));
    }
)

export const makeDealBestOfferLoading = () => {
    return dealBestOfferLoading;
}

// Show me the best offer for a specific deal or default to no best offer
const dealBestOffer = createSelector(
    [bestOffers, dealBestOfferKey],
    (bestOffers, dealBestOfferKey) => {
        return R.prop(dealBestOfferKey,  bestOffers) || {totalValue: 0, programs: []};
    }
)

export const makeDealBestOffer = () => {
    return dealBestOffer;
}

// Get the total value of the best offer for the deal
const dealBestOfferTotalValue = createSelector(
    [dealBestOffer],
    (dealBestOffer) => {
        return R.prop('totalValue', dealBestOffer);
    }
)

export const makeDealBestOfferTotalValue = () => {
    return dealBestOfferTotalValue;
}