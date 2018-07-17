export const getUserLocation = state => {
    return state.user.location;
};

export const getUserZipcode = state => {
    return state.user.location.zipcode;
};

export const getUserPurchaseStrategy = state => {
    return state.user.purchasePreferences.strategy;
};
