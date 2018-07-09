import R from 'ramda';

import { fork, put, takeEvery, call, select } from 'redux-saga/effects';

import { INIT } from './consts';
import { requestIpLocation } from 'apps/user/sagas';
import { setCurrentPage } from 'apps/page/actions';
import ApiClient from 'store/api';

import { receiveCompareData } from './actions';
import { batchRequestDealQuotes } from 'apps/pricing/actions';
import { getComparedDeals } from './selectors';

/*******************************************************************
 * Init
 ********************************************************************/
function* init() {
    yield put(setCurrentPage('compare'));
    yield fork(requestIpLocation);
    const state = yield select();

    let dealIds = R.pluck('deal', state.common.compareList);
    dealIds = R.pluck('id', dealIds);
    let results = null;

    try {
        results = yield call(ApiClient.deal.compare, dealIds);
        results = results.data;
    } catch (e) {
        results = false;
        console.log(e);
    }
    yield put(receiveCompareData(results));

    const deals = yield select(getComparedDeals);
    yield put(batchRequestDealQuotes(deals));
}

/*******************************************************************
 * Watchers
 ********************************************************************/
export function* watchInit() {
    yield takeEvery(INIT, init);
}
