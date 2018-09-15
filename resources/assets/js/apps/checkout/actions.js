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
    supplierBrand
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

export function checkoutStart(pricing) {
    return {
        type: ActionTypes.CHECKOUT_START,
        pricing,
    };
}

export function checkoutContact(fields) {
    return {
        type: ActionTypes.CHECKOUT_CONTACT,
        fields,
    };
}

export function clearCheckoutContactFormErrors() {
    return {
        type: ActionTypes.CLEAR_CHECKOUT_CONTACT_FORM_ERRORS,
    };
}

export function setCheckoutContactFormErrors(errors) {
    return {
        type: ActionTypes.SET_CHECKOUT_CONTACT_FORM_ERRORS,
        errors,
    };
}
