import {
    fork,
    put,
    call,
    select,
    take,
    cancel,
    cancelled,
} from 'redux-saga/effects';
import ApiClient from 'store/api';
import axios from 'axios';
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
    const CancelToken = axios.CancelToken;
    const source = CancelToken.source();
    const state = yield select();
    let results = null;

    if (state.searchQuery.page === 1) {
        yield put({ type: ActionTypes.SEARCH_LOADING_START });
    }

    try {
        results = yield call(ApiClient.browse.search, state.searchQuery);
    } catch (e) {
        console.log(e);
    } finally {
        if (yield cancelled()) {
            source.cancel();
        }
    }

    if (results) {
        if (state.searchQuery.entity === 'deal') {
            yield put(Actions.receiveDeals(results));
            yield fork(DealSagas.batchRequestDealQuotes, results.data.data);
        } else {
            yield put(Actions.receiveModelYears(results));
        }
    }

    if (state.searchQuery.page === 1) {
        yield put({ type: ActionTypes.SEARCH_LOADING_FINISHED });
    }
}

export function* watchRequestSearch() {
    yield takeSearch(ActionTypes.SEARCH_REQUEST, requestSearch);
}
