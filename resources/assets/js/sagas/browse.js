import { fork, put, call, select, takeLatest } from 'redux-saga/effects';
import ApiClient from 'store/api';
import * as ActionTypes from 'actiontypes/index';
import * as Actions from 'actions/index';
import * as DealSagas from 'sagas/deal';

/**
 * @returns {IterableIterator<*>}
 */
function* requestSearch() {
    const state = yield select();

    const results = yield call(ApiClient.search, state.searchQuery);

    if (state.searchQuery.entity === 'deal') {
        yield put(Actions.receiveDeals(results));
        yield fork(DealSagas.batchRequestDealQuotes, results.data.data);
    } else {
        yield put(Actions.receiveModelYears(results));
    }
}

export function* watchRequestSearch() {
    yield takeLatest(ActionTypes.REQUEST_SEARCH, requestSearch);
}
