export const getDeal = state => {
    return state.pages.dealDetails.deal;
};

export const getDiscountType = state => {
    return state.pages.dealDetails.discount.discountType;
};

export const getConditionalRoles = state => {
    return state.pages.dealDetails.discount.conditionalRoles;
};
