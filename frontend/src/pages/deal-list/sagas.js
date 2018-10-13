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
import ApiClient from '../../store/api';
import { cancelRequest } from '../../store/httpclient';
import * as R from 'ramda';

import {
    INIT,
    SEARCH_LOADING_START,
    SEARCH_LOADING_FINISHED,
    SEARCH_REQUEST,
    SEARCH_TOGGLE_FILTER,
} from './consts';

import { batchRequestDealQuotes } from '../../apps/pricing/sagas';
import * as DealListActions from './actions';

import getDealList, { getSearchQuery } from './selectors';
import { getUserLocation } from '../../apps/user/selectors';
import { initPage } from '../../apps/page/sagas';

import { track } from '../../services';
import * as ActionTypes from './consts';

import { push } from 'connected-react-router';

import { buildSearchQueryUrl } from './helpers';
import queryString from 'query-string';
import { setPurchaseStrategy } from '../../apps/user/actions';

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
            if (lastTask && (state.page === 1 || !state.page)) {
                yield cancel(lastTask); // cancel is no-op if the task has already terminated
            }
            lastTask = yield fork(saga, ...args.concat(action));
        }
    });

/**
 * @returns {IterableIterator<*>}
 */
function* requestSearch(action) {
    if (action.incrementPage) {
        yield put({ type: ActionTypes.SEARCH_INCREMENT_PAGE });
    }

    if (action.sort) {
        yield put({
            type: ActionTypes.SEARCH_CHANGE_SORT,
            sort: action.sort,
        });
    }

    const source = cancelRequest();
    const state = yield select();
    const searchQuery = getSearchQuery(state);

    let results = [];

    yield put({ type: SEARCH_LOADING_START });

    try {
        results = yield call(
            ApiClient.browse.search,
            searchQuery,
            source.token
        );
        results = results.data;
    } catch (e) {
        console.log(e);
        results = false;
    } finally {
        if (yield cancelled()) {
            source.cancel();
        }
    }

    yield put(DealListActions.receiveSearch(results));

    if (searchQuery.entity === 'deal') {
        yield put(DealListActions.receiveDeals(results));
    } else {
        yield put(DealListActions.receiveModelYears(results));
    }

    if (results && searchQuery.entity === 'deal') {
        yield fork(batchRequestDealQuotes, results.results);
    }

    yield put({ type: SEARCH_LOADING_FINISHED });

    const urlQuery = buildSearchQueryUrl(searchQuery);
    if (urlQuery) {
        const dealListPage = yield select(getDealList);
        yield put(
            push('/filter?' + urlQuery, {
                query: searchQuery,
                page: dealListPage,
            })
        );
    }
}

/**
 * @returns {IterableIterator<*>}
 */
function* searchToggleFilter(action) {
    yield put({ type: SEARCH_LOADING_START });

    const state = yield select();
    const searchQuery = getSearchQuery(state);
    let currentFilters = searchQuery.filters;
    const operation = action.operation;
    const category = action.category;
    const item = action.item;

    if (operation === 'TOGGLE') {
        const key = `${category}:${item.value}`;

        let index = currentFilters.indexOf(key);
        let action = 'ADD';
        if (index !== -1) {
            currentFilters.splice(index, 1);
            action = 'REMOVE';
        } else {
            currentFilters.push(key);
        }

        track('search:filter:toggle', {
            'Filter Category': category,
            'Filter Item': item.value,
            'Filter Action': action,
        });
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
function* init(action) {
    const { location, dataOnly } = action.data;
    if (!dataOnly) {
        yield* initPage('deal-list');
    }

    // User is coming in fresh without any existing state.
    // Means the user either clicked a deep link or came from
    // the brochure site.
    if (location.state === undefined) {
        const query = queryString.parse(location.search, {
            arrayFormat: 'bracket',
        });

        // Not from the brochure site
        if (query.purchaseStrategy && query.entity) {
            yield put(setPurchaseStrategy(query.purchaseStrategy));

            const data = {
                page: query.page,
                searchQuery: {
                    entity: 'model',
                    sort: 'payment',
                    filters: [],
                    ...query,
                },
            };

            delete data.searchQuery.page;
            yield put(DealListActions.searchReset(data));
        }
    }

    if (!dataOnly) {
        const dealListPage = yield select(getDealList);
        let userCurrentLocation = yield select(getUserLocation);

        if (
            dealListPage.showMakeSelectorModal === null &&
            userCurrentLocation.latitude
        ) {
            yield put(DealListActions.openMakeSelectorModal());
        }

        track('page:search:view');
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
