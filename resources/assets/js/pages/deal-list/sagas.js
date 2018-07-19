import {
    fork,
    put,
    call,
    select,
    take,
    takeEvery,
    cancel,
    cancelled,
} from 'redux-saga/effects';
import ApiClient from 'store/api';
import { cancelRequest } from 'store/httpclient';
import R from 'ramda';

import {
    INIT,
    SEARCH_LOADING_START,
    SEARCH_LOADING_FINISHED,
    SEARCH_REQUEST,
    SEARCH_TOGGLE_FILTER,
} from './consts';

import { batchRequestDealQuotes } from 'apps/pricing/sagas';
import * as DealListActions from './actions';

import getDealList, { getSearchQuery } from './selectors';
import { getUserLocation } from 'apps/user/selectors';
import { initPage } from 'apps/page/sagas';

import util from 'src/util';

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

    let results = [];

    if (searchQuery.page === 1) {
        yield put({ type: SEARCH_LOADING_START });
    }

    try {
        results = yield call(ApiClient.browse.search, searchQuery);
        results = results.data;
    } catch (e) {
        console.log(e);
    } finally {
        if (yield cancelled()) {
            source.cancel();
        }
    }

    yield put(DealListActions.receiveSearch(results));

    if (results) {
        if (searchQuery.entity === 'deal') {
            yield put(DealListActions.receiveDeals(results));
            yield fork(batchRequestDealQuotes, results.results);
        } else {
            yield put(DealListActions.receiveModelYears(results));
        }
    }

    if (searchQuery.page === 1) {
        yield put({ type: SEARCH_LOADING_FINISHED });
    }
}

/**
 * @returns {IterableIterator<*>}
 */
function* searchToggleFilter(action) {
    const state = yield select();
    const searchQuery = getSearchQuery(state);
    let currentFilters = searchQuery.filters;
    const operation = action.operation;
    const category = action.category;
    const item = action.item;

    if (operation === 'TOGGLE') {
        const key = `${category}:${item.value}`;

        let index = currentFilters.indexOf(key);
        if (index !== -1) {
            currentFilters.splice(index, 1);
        } else {
            currentFilters.push(key);
        }
    } else if (operation === 'KEEP_CATEGORY') {
        const categories_to_keep = !Array.isArray(category)
            ? [category]
            : category;

        currentFilters = R.filter(function(filter) {
            let keep = false;
            categories_to_keep.forEach(function(category_name) {
                if (filter.includes(category_name + ':')) {
                    keep = true;
                }
            });
            return keep;
        }, currentFilters);
    } else if (operation === 'REMOVE_CATEGORY') {
        const categories_to_remove = !Array.isArray(category)
            ? [category]
            : category;

        currentFilters = R.filter(function(filter) {
            let keep = true;
            categories_to_remove.forEach(function(category_name) {
                if (filter.includes(category_name + ':')) {
                    keep = false;
                }
            });
            return keep;
        }, currentFilters);
    }

    yield put(DealListActions.setSearchFilters(currentFilters));
    yield put({ type: SEARCH_REQUEST });
}

/*******************************************************************
 * Init
 ********************************************************************/
function* init() {
    yield* initPage('deal-list');

    let userCurrentLocation = yield select(getUserLocation);
    const dealListPage = yield select(getDealList);
    if (
        dealListPage.showMakeSelectorModal === null &&
        userCurrentLocation.latitude
    ) {
        yield put(DealListActions.openMakeSelectorModal());
    }

    const urlStyle = util.getInitialBodyStyleFromUrl();
    const urlSize = util.getInitialSizeFromUrl();
    if (urlStyle || urlSize) {
        let filters = [];

        /*
        if (urlSize) {
            filters.push('size:' + urlSize);
        }
        */

        if (urlStyle) {
            filters.push('style:' + urlStyle);
        }

        yield put(DealListActions.searchReset());
        yield put(DealListActions.setSearchFilters(filters));

        window.history.replaceState({}, document.title, '/filter');
    }

    yield put({ type: SEARCH_REQUEST });
}

/*******************************************************************
 * Watchers
 ********************************************************************/
export function* watchRequestSearch() {
    yield takeSearch(SEARCH_REQUEST, requestSearch);
}

export function* watchToggleSearchFilter() {
    yield takeEvery(SEARCH_TOGGLE_FILTER, searchToggleFilter);
}

export function* watchInit() {
    yield takeEvery(INIT, init);
}
