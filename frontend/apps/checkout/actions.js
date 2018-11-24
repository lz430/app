import * as ActionTypes from './consts';

export function setCheckoutData(
    deal,
    quote,
    strategy,
    role,
    term,
    financeDownPayment,
    leaseAnnualMileage,
    employeeBrand,
    supplierBrand,
    tradeIn
) {
    return {
        type: ActionTypes.SET_CHECKOUT_DATA,
        deal,
        quote,
        strategy,
        role,
        term,
        financeDownPayment,
        leaseAnnualMileage,
        employeeBrand,
        supplierBrand,
        tradeIn,
    };
}

export function receivePurchase(data) {
    return {
        type: ActionTypes.RECEIVE_PURCHASE,
        data: data,
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

export function checkoutStart(pricing, router) {
    return {
        type: ActionTypes.CHECKOUT_START,
        pricing,
        router: router,
    };
}

export function checkoutContact(values, actions) {
    return {
        type: ActionTypes.CHECKOUT_CONTACT,
        values,
        actions: actions,
    };
}

export function checkoutFinancingComplete(fields) {
    return {
        type: ActionTypes.CHECKOUT_FINANCING_COMPLETE,
        fields,
    };
}
