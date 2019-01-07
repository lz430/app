import { put, select, takeLatest, call, cancelled } from 'redux-saga/effects';

import { requestIpLocation } from '../../apps/user/sagas';
import { getUserLocation } from '../../apps/user/selectors';

import {
    setCurrentPage,
    pageLoadingStart,
    pageLoadingFinished,
    headerReceiveAutocomplete,
} from './actions';
import { cancelRequest } from '../../store/httpclient';

import ApiClient from '../../store/api';
import { REQUEST_AUTOCOMPLETE } from './consts';

import { track } from '../../core/services';

/**
 *
 * @param page
 * @param handlePageLoadingFinished
 * @returns {IterableIterator<*>}
 */
export function* initPage(page, handlePageLoadingFinished = true) {
    // Set page
    yield put(setCurrentPage(page));

    //
    // Find user location if necessary
    let userCurrentLocation = yield select(getUserLocation);
    if (!userCurrentLocation.latitude || !userCurrentLocation.longitude) {
        yield put(pageLoadingStart());
    }

    yield* requestIpLocation({});

    if (handlePageLoadingFinished) {
        yield put(pageLoadingFinished());
    }
}

/**
 * @returns {IterableIterator<*>}
 */
function* requestSearchAutocomplete(action) {
    const source = cancelRequest();
    const query = action.data;

    let results = {};

    try {
        results = yield call(
            ApiClient.browse.autocomplete,
            query,
            source.token
        );
        results = results.data;
    } catch (e) {
        console.log(e);
    } finally {
        if (yield cancelled()) {
            source.cancel();
        }
    }

    const hasResults = !!(
        results.model.length ||
        results.make.length ||
        results.style.length
    );

    track('search:bar:results', {
        'Search Query': query,
        'Search Has Results': hasResults,
    });

    yield put(headerReceiveAutocomplete(results));
}

/*******************************************************************
 * Watchers
 ********************************************************************/

export function* watchRequestAutocomplete() {
    yield takeLatest(REQUEST_AUTOCOMPLETE, requestSearchAutocomplete);
}
