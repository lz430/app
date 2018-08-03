import { put, call, select, takeEvery } from 'redux-saga/effects';

import ApiClient from 'store/api';

import { CHECKOUT_START, CHECKOUT_CONTACT } from './consts';

import {
    checkoutIsLoading,
    checkoutFinishedLoading,
    setCheckoutContactFormErrors,
} from './actions';
import { checkout as getCheckout } from './selectors';

/*******************************************************************
 * Checkout Start
 *******************************************************************/
export function* checkoutStart(action) {
    yield put(checkoutIsLoading());

    const checkout = yield select(getCheckout);
    const dealPricing = action.dealPricing;

    let amounts = {
        role: checkout.role,
        taxes_and_fees: dealPricing.taxesAndFees(),
        price: dealPricing.discountedPriceValue(),
    };

    if (checkout.strategy === 'finance') {
        amounts['financed_amount'] = dealPricing.amountFinancedValue();
        amounts[
            'financed_down_payment'
        ] = dealPricing.financeDownPaymentValue();

        amounts['term'] = dealPricing.financeTermValue();
        amounts['monthly_payment'] = dealPricing.monthlyPaymentsValue();
    } else if (checkout.strategy === 'lease') {
        amounts[
            'leased_annual_mileage'
        ] = dealPricing.leaseAnnualMileageValue();

        amounts['term'] = dealPricing.leaseTermValue();
        amounts['monthly_payment'] = dealPricing.monthlyPaymentsValue();
    }
    let results = null;
    try {
        results = yield call(
            ApiClient.checkout.start,
            checkout.deal.id,
            checkout.strategy,
            checkout.quote,
            amounts
        );
    } catch (e) {
        console.log(e);
    }

    yield put(checkoutFinishedLoading());
    window.location = `/confirm/${dealPricing.id()}`;
}

/*******************************************************************
 * Checkout Contact
 *******************************************************************/
export function* checkoutContact(action) {
    const fields = action.fields;
    let results = null;
    try {
        results = yield call(
            ApiClient.checkout.contact,
            fields.email,
            fields.drivers_license_state,
            fields.drivers_license_number,
            fields.first_name,
            fields.last_name,
            fields.phone_number,
            fields.g_recaptcha_response
        );
    } catch (e) {
        yield put(setCheckoutContactFormErrors(e.response.data.errors));
    }

    if (results) {
        window.location = results.data.destination;
    }
}

/*******************************************************************
 * Watchers
 *******************************************************************/
export function* watchCheckoutStart() {
    yield takeEvery(CHECKOUT_START, checkoutStart);
}

export function* watchCheckoutContact() {
    yield takeEvery(CHECKOUT_CONTACT, checkoutContact);
}
