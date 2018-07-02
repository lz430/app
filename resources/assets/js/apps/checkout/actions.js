import * as ActionTypes from './consts';

export function setCheckoutData(
    deal,
    quote,
    strategy,
    role,
    term,
    financeDownPayment,
    leaseAnnualMileage
) {
    return {
        type: ActionTypes.SET_CHECKOUT_DATA,
        deal: deal,
        quote: quote,
        strategy: strategy,
        role: role,
        term: term,
        financeDownPayment: financeDownPayment,
        leaseAnnualMileage: leaseAnnualMileage,
    };
}
