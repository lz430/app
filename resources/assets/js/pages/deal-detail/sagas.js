import { put, takeEvery, select } from 'redux-saga/effects';

import { INIT, REQUEST_DEAL_QUOTE } from './consts';

import { requestIpLocation } from 'apps/user/sagas';
import { setCurrentPage } from 'apps/page/actions';

import {
    getDeal,
    getActiveQuote,
    getFinanceSettings,
    getLeaseSettings,
} from './selectors';
import { getUserLocation, getUserPurchaseStrategy } from 'apps/user/selectors';
import { requestDealQuote as requestDealQuoteAction } from 'apps/pricing/actions';
import { requestDealQuote } from 'apps/pricing/sagas';
import { discountType as getDiscountType } from 'apps/common/selectors';

import { updateDownPayment, updateTerm } from './modules/finance';
import {
    updateAnnualMileage,
    updateTerm as leaseUpdateTerm,
} from './modules/lease';

/*******************************************************************
 * Request Deal Quote
 ********************************************************************/
/**
 * Maybe there is a smarter way to do this.
 * @returns {IterableIterator<*>}
 */
function* dealDetailRequestDealQuote() {
    const deal = yield select(getDeal);
    const location = yield select(getUserLocation);
    const purchaseStrategy = yield select(getUserPurchaseStrategy);
    const discountType = yield select(getDiscountType);

    // Do the regular.
    yield* requestDealQuote(
        requestDealQuoteAction(
            deal,
            location.zipcode,
            purchaseStrategy,
            discountType
        )
    );
}

/*******************************************************************
 * Init
 ********************************************************************/
function* init() {
    yield put(setCurrentPage('deal-detail'));
    yield* requestIpLocation();
    yield* dealDetailRequestDealQuote();
}

/*******************************************************************
 * Watchers
 ********************************************************************/
export function* watchInit() {
    yield takeEvery(INIT, init);
}

export function* watchRequestDealQuote() {
    yield takeEvery(REQUEST_DEAL_QUOTE, dealDetailRequestDealQuote);
}
