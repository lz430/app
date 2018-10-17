import { pluck } from 'ramda';

import { put, takeEvery, call, select } from 'redux-saga/effects';

import { INIT } from './consts';

import ApiClient from '../../store/api';

import { receiveCompareData } from './actions';
import { batchRequestDealQuotes } from '../../apps/pricing/actions';
import { getComparedDeals } from './selectors';
import { initPage } from '../../apps/page/sagas';
import { pageLoadingFinished, pageLoadingStart } from '../../apps/page/actions';
import { track } from '../../services';

/*******************************************************************
 * Init
 ********************************************************************/
function* init() {
    yield put(pageLoadingStart());
    yield* initPage('compare', false);

    const state = yield select();

    let dealIds = pluck('deal', state.common.compareList);
    dealIds = pluck('id', dealIds);

    if (dealIds && dealIds.length) {
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

        track('page:compare:view', {
            'Compare Deals Count': deals.length,
            'Compare Deals': pluck('title', deals),
        });
    }

    yield put(pageLoadingFinished());
}

/*******************************************************************
 * Watchers
 ********************************************************************/
export function* watchInit() {
    yield takeEvery(INIT, init);
}
