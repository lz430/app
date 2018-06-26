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

    const key = `${state.pages.dealDetails.deal.id}-${
        state.user.purchasePreferences.strategy
    }-${state.user.location.zipcode}`;

    if (state.pricing.quotes[key]) {
        return state.pricing.quotes[key];
    } else {
        return null;
    }
};
