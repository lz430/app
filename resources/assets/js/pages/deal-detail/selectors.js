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
