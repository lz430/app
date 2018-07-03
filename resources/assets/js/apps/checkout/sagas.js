import { put, call, select, takeEvery } from 'redux-saga/effects';

import ApiClient from 'store/api';

import { CHECKOUT_START } from './consts';

import { checkoutIsLoading, checkoutFinishedLoading } from './actions';
import { checkout as getCheckout } from './selectors';

/*******************************************************************
 * Checkout Start
 ********************************************************************/
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

    try {
        yield call(
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
}

/*******************************************************************
 * Watchers
 ********************************************************************/

export function* watchCheckoutStart() {
    yield takeEvery(CHECKOUT_START, checkoutStart);
}
