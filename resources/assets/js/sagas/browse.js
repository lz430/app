import { fork, put, call, select, take, cancel } from 'redux-saga/effects';
import ApiClient from 'store/api';
import * as ActionTypes from 'actiontypes/index';
import * as Actions from 'actions/index';
import * as DealSagas from 'sagas/deal';

/**
 * Based on takeLatest but doesn't cancel if it's just a pagination request.
 * @param patternOrChannel
 * @param saga
 * @param args
 * @returns {ForkEffect | *}
 */
const takeSearch = (patternOrChannel, saga, ...args) =>
    fork(function*() {
        let lastTask;
        while (true) {
            const action = yield take(patternOrChannel);
            const state = yield select();
            if (lastTask && state.searchQuery.page === 1) {
                yield cancel(lastTask); // cancel is no-op if the task has already terminated
            }
            lastTask = yield fork(saga, ...args.concat(action));
        }
    });

/**
 * @returns {IterableIterator<*>}
 */
function* requestSearch() {
    console.log('requestSearch');
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
    yield takeSearch(ActionTypes.SEARCH_REQUEST, requestSearch);
}
