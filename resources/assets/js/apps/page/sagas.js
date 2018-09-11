import { put, select } from 'redux-saga/effects';

import { requestIpLocation } from 'apps/user/sagas';
import { getUserLocation } from 'apps/user/selectors';

import {
    setCurrentPage,
    pageLoadingStart,
    pageLoadingFinished,
} from './actions';

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

    yield* requestIpLocation();

    if (handlePageLoadingFinished) {
        yield put(pageLoadingFinished());
    }
}
