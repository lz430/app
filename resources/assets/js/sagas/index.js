import { take, put, call, fork, select, takeLatest, all } from 'redux-saga/effects'
import ApiClient from 'store/api';
import * as ActionTypes from 'actiontypes/index';
import * as Actions from 'actions/index';

/**
 * @returns {IterableIterator<*>}
 */
export function* requestSearch() {
    const state = yield select();

    const results = yield call(ApiClient.search, state.searchQuery);

    if (state.searchQuery.entity === "deal") {
        yield put(Actions.receiveDeals(results));
    } else {
        yield put(Actions.receiveModelYears(results));
    }
}

export function* watchRequestSearch() {
    yield takeLatest(ActionTypes.REQUEST_SEARCH, requestSearch)
}

export default function* root() {
    yield all([fork(requestSearch), fork(watchRequestSearch)])
}