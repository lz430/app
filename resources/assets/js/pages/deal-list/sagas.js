import {
    fork,
    all,
    put,
    call,
    select,
    take,
    takeLatest,
    takeEvery,
    cancel,
    cancelled,
} from 'redux-saga/effects';
import ApiClient from 'store/api';
import { cancelRequest } from 'store/httpclient';

import {
    INIT,
    RECEIVE_MAKES,
    RECEIVE_BODY_STYLES,
    RECEIVE_FEATURES,
    RECEIVE_FEATURE_CATEGORIES,
    SEARCH_LOADING_START,
    SEARCH_LOADING_FINISHED,
    SEARCH_REQUEST,
} from './consts';

import * as DealSagas from 'apps/common/sagas';
import * as DealListActions from './actions';

import getDealList, { getSearchQuery } from './selectors';
import { requestIpLocation } from 'apps/user/sagas';
import { setCurrentPage } from 'apps/page/actions';

/*******************************************************************
 * Request Search
 ********************************************************************/
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
            const state = yield select(getDealList);
            if (lastTask && state.page === 1) {
                yield cancel(lastTask); // cancel is no-op if the task has already terminated
            }
            lastTask = yield fork(saga, ...args.concat(action));
        }
    });

/**
 * @returns {IterableIterator<*>}
 */
function* requestSearch() {
    const source = cancelRequest();
    const state = yield select();
    const searchQuery = getSearchQuery(state);

    let results = null;

    if (searchQuery.page === 1) {
        yield put({ type: SEARCH_LOADING_START });
    }

    try {
        results = yield call(ApiClient.browse.search, searchQuery);
    } catch (e) {
        console.log(e);
    } finally {
        if (yield cancelled()) {
            source.cancel();
        }
    }

    if (results) {
        if (searchQuery.entity === 'deal') {
            yield put(DealListActions.receiveDeals(results));
            yield fork(DealSagas.batchRequestDealQuotes, results.data.data);
        } else {
            yield put(DealListActions.receiveModelYears(results));
        }
    }

    if (searchQuery.page === 1) {
        yield put({ type: SEARCH_LOADING_FINISHED });
    }
}

/*******************************************************************
 * Init
 ********************************************************************/
function* init() {
    yield put(setCurrentPage('deal-list'));
    yield fork(requestIpLocation);

    try {
        const [styles, makes, features, categories] = yield all([
            call(ApiClient.browse.getBodyStyles),
            call(ApiClient.browse.getMakes),
            call(ApiClient.browse.getFeatures),
            call(ApiClient.browse.getFeatureCategories),
        ]);

        yield all([
            put(DealListActions.receiveBodyStyles(styles)),
            put(DealListActions.receiveMakes(makes)),
            put(DealListActions.receiveFeatures(features)),
            put(DealListActions.receiveFeatureCategories(categories)),
        ]);
    } catch (e) {
        console.log(e);
    }

    yield put({ type: SEARCH_REQUEST });
}

/*******************************************************************
 * Watchers
 ********************************************************************/
export function* watchRequestSearch() {
    yield takeSearch(SEARCH_REQUEST, requestSearch);
}

export function* watchInit() {
    yield takeEvery(INIT, init);
}
