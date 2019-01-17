import { put, call, select, takeEvery } from 'redux-saga/effects';
import ApiClient from '../../store/api';

import {
    CHECKOUT_START,
    CHECKOUT_CONTACT,
    CHECKOUT_FINANCING_COMPLETE,
} from './consts';

import {
    checkoutIsLoading,
    checkoutFinishedLoading,
    receivePurchase,
} from './actions';
import { checkout as getCheckout } from './selectors';
import { track } from '../../core/services';

import Router from 'next/router';

import { storeSessionData } from '../session/manager';
import { softUpdateSessionData } from '../session/actions';
import { getCSRFToken } from '../session/sagas';

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
            amounts,
            checkout.tradeIn
        );
        results = results.data;
    } catch (e) {
        console.log(e);
    }
    if (results) {
        const csrfToken = yield call(getCSRFToken);
        storeSessionData(
            { purchase: { id: results.purchase.id } },
            null,
            csrfToken
        );
        yield put(
            softUpdateSessionData({ purchase: { id: results.purchase.id } })
        );
    }

    track('deal-detail:quote-form:submitted', {
        'Form Submission Success': results ? 'success' : 'fail',
    });

    if (results) {
        yield put(receivePurchase(results));
        yield put(checkoutFinishedLoading());
        Router.push('/checkout-contact', '/checkout/contact');
    }
}

/*******************************************************************
 * Checkout Contact
 *******************************************************************/
export function* checkoutContact(action) {
    const values = action.values;
    const actions = action.actions;
    const checkout = yield select(getCheckout);

    let results = null;
    try {
        results = yield call(
            ApiClient.checkout.contact,
            checkout.purchase.id,
            checkout.orderToken,
            values.email,
            values.drivers_license_state,
            values.drivers_license_number,
            values.first_name,
            values.last_name,
            values.phone_number,
            values.g_recaptcha_response
        );
        results = results.data;
        actions.setStatus({ success: true });
    } catch (error) {
        actions.setStatus({ success: false });
        actions.setSubmitting(false);
        actions.setErrors(ApiClient.translateApiErrors(error.response.data));
    }

    track('checkout-confirm:contact-form:submitted', {
        'Form Submission Success': results ? 'success' : 'fail',
    });

    if (results) {
        const csrfToken = yield call(getCSRFToken);
        const sessionData = {
            guestUser: {
                first_name: values.first_name,
                last_name: values.last_name,
                email: values.email,
                id: results.purchase.user_id,
            },
            purchase: {
                id: results.purchase.id,
                status: results.purchase.status,
            },
        };

        storeSessionData(sessionData, null, csrfToken);
        yield put(softUpdateSessionData(sessionData));
    }

    if (results) {
        yield put(receivePurchase(results));
        Router.push(results.destination);
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
    } catch (e) {
        results = false;
    }

    if (results) {
        Router.push('checkout-complete', '/checkout/complete');
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
