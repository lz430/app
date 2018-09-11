export const getDeal = state => {
    return state.pages.dealDetails.deal;
};

export const getFinanceSettings = state => {
    return state.pages.dealDetails.finance;
};

export const getLeaseSettings = state => {
    return state.pages.dealDetails.lease;
};

export const getConditionalRoles = state => {
    return state.pages.dealDetails.selectDiscount.conditionalRoles;
};

export const getLeaseTerm = state => {
    return state.pages.dealDetails.lease.term;
};

export const getLeaseAnnualMileage = state => {
    return state.pages.dealDetails.lease.annualMileage;
};
