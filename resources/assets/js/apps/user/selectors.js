export const getUserLocation = state => {
    return state.user.location;
};

export const getUserPurchaseStrategy = state => {
    return state.user.purchasePreferences.strategy;
};
