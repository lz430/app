export const getUserLocation = state => {
    return state.session.location;
};

export const getUserZipcode = state => {
    return state.session.location.zipcode;
};

export const getUserPurchaseStrategy = state => {
    return state.user.purchasePreferences.strategy;
};
