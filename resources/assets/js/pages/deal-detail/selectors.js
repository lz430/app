import { dealQuoteKey } from 'apps/pricing/helpers';

export const getDeal = state => {
    return state.pages.dealDetails.deal;
};

export const getActiveQuote = state => {
    if (
        !state.pages.dealDetails.deal ||
        !state.user.purchasePreferences.strategy ||
        !state.user.location.zipcode
    ) {
        return null;
    }

    const discountType = state.pages.dealDetails.selectDiscount.discountType;

    const key = dealQuoteKey(
        state.pages.dealDetails.deal,
        state.user.location.zipcode,
        state.user.purchasePreferences.strategy,
        discountType
    );

    if (state.pricing.quotes[key]) {
        return state.pricing.quotes[key];
    } else {
        return null;
    }
};

export const getFinanceSettings = state => {
    return state.pages.dealDetails.finance;
};

export const getLeaseSettings = state => {
    return state.pages.dealDetails.lease;
};

export const getLeaseTerm = (state, props) => {
    const dealId = props.deal.id;
    const zipcode = state.user.location.zipcode;
    const key = `${dealId}.${zipcode}`;
    if (state.pages.dealDetails.lease.term[key]) {
        return state.pages.dealDetails.lease.term[key];
    }
    return null;
};

export const getLeaseAnnualMileage = (state, props) => {
    const dealId = props.deal.id;
    const zipcode = state.user.location.zipcode;
    const key = `${dealId}.${zipcode}`;
    if (state.pages.dealDetails.lease.annualMileage[key]) {
        return state.pages.dealDetails.lease.annualMileage[key];
    }
    return null;
};
