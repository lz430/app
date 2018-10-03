import { put, call, select, takeEvery } from 'redux-saga/effects';
import { push } from 'connected-react-router';
import ApiClient from 'store/api';

import {
    CHECKOUT_START,
    CHECKOUT_CONTACT,
    CHECKOUT_FINANCING_COMPLETE,
} from './consts';

import {
    checkoutIsLoading,
    checkoutFinishedLoading,
    setCheckoutContactFormErrors,
    receivePurchase,
} from './actions';
import { checkout as getCheckout } from './selectors';
import { track } from 'services';

function toDollarsAndCents(input) {
    return input.toFormat('0.00');
}

/*******************************************************************
 * Checkout Start
 *******************************************************************/
export function* checkoutStart(action) {
    yield put(checkoutIsLoading());

    const checkout = yield select(getCheckout);
    const pricing = action.pricing;

    let amounts = {
        role: checkout.role,
        price: toDollarsAndCents(pricing.discountedPrice()),
    };

    if (checkout.strategy === 'finance') {
        amounts['financed_amount'] = toDollarsAndCents(
            pricing.amountFinanced()
        );
        amounts['down_payment'] = toDollarsAndCents(pricing.downPayment());

        amounts['term'] = pricing.term();
        amounts['monthly_payment'] = toDollarsAndCents(
            pricing.monthlyPayment()
        );
    } else if (checkout.strategy === 'lease') {
        amounts['leased_annual_mileage'] = pricing.annualMileage();

        amounts['term'] = pricing.term();
        amounts['monthly_payment'] = toDollarsAndCents(
            pricing.monthlyPayment()
        );
        amounts['down_payment'] = toDollarsAndCents(
            pricing.totalAmountAtDriveOff()
        );
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

    track('deal-detail:quote-form:submitted', {
        'Form Submission Success': results ? 'success' : 'fail',
    });

    if (results) {
        yield put(receivePurchase(results.data));
        yield put(checkoutFinishedLoading());
        yield put(push('/checkout/contact'));
    }
}

/*******************************************************************
 * Checkout Contact
 *******************************************************************/
export function* checkoutContact(action) {
    const fields = action.fields;
    const checkout = yield select(getCheckout);

    let results = null;
    try {
        results = yield call(
            ApiClient.checkout.contact,
            checkout.purchase.id,
            checkout.orderToken,
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

    track('checkout-confirm:contact-form:submitted', {
        'Form Submission Success': results ? 'success' : 'fail',
    });

    if (results) {
        yield put(receivePurchase(results.data));
        yield put(push(results.data.destination));
    }
}

/*******************************************************************
 * Checkout Financing Compete Form
 *******************************************************************/
export function* checkoutFinancingComplete() {
    const checkout = yield select(getCheckout);

    let results = null;
    try {
        results = yield call(
            ApiClient.checkout.financingComplete,
            checkout.purchase.id,
            checkout.userToken
        );
    } catch (e) {}

    if (results) {
        yield put(push('/checkout/complete'));
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

export function* watchCheckoutFinancingComplete() {
    yield takeEvery(CHECKOUT_FINANCING_COMPLETE, checkoutFinancingComplete);
}
