import { put, takeEvery, select } from 'redux-saga/effects';

import { INIT } from './consts';

import { requestIpLocation } from 'apps/user/sagas';
import { setCurrentPage } from 'apps/page/actions';

import { getDeal } from './selectors';
import { getUserLocation, getUserPurchaseStrategy } from 'apps/user/selectors';
import { requestDealQuote } from 'apps/pricing/actions';

/*******************************************************************
 * Init
 ********************************************************************/
function* init() {
    const deal = yield select(getDeal);
    yield put(setCurrentPage('deal-detail'));
    yield* requestIpLocation();

    const location = yield select(getUserLocation);
    const purchaseStrategy = yield select(getUserPurchaseStrategy);

    yield put(requestDealQuote(deal, location.zipcode, purchaseStrategy));
}

/*******************************************************************
 * Watchers
 ********************************************************************/

export function* watchInit() {
    yield takeEvery(INIT, init);
}
