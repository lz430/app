export const getDeal = state => {
    return state.pages.dealDetails.deal;
};

export const getConditionalRoles = state => {
    return state.pages.dealDetails.discount.conditionalRoles;
};
