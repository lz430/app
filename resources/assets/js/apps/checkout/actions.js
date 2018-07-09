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

export function checkoutIsLoading() {
    return {
        type: ActionTypes.CHECKOUT_IS_LOADING,
    };
}

export function checkoutFinishedLoading() {
    return {
        type: ActionTypes.CHECKOUT_IS_FINISHED_LOADING,
    };
}

export function checkoutStart(dealPricing) {
    console.log(dealPricing);
    return {
        type: ActionTypes.CHECKOUT_START,
        dealPricing: dealPricing,
    };
}
