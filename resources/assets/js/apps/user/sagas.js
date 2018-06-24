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
import jsonp from 'jsonp';

import api from 'store/api';

import { REQUEST_IP_LOCATION_INFO, REQUEST_LOCATION } from './consts';
import { receiveLocation } from './actions';

/*******************************************************************
 * Request IP Location
 ********************************************************************/

/**
 * Axois doesn't support JSONP.
 * @returns {Promise<any>}
 */
function getIpLocation() {
    const url =
        'http://api.ipstack.com/check?access_key=af71ee691359c9ccdacefb9137a3ff5b&format=1';

    return new Promise(resolve => {
        jsonp(url, null, function(err, data) {
            if (err) {
                resolve(null);
            } else {
                resolve(data);
            }
        });
    });
}

export function* requestIpLocation() {
    let ipLocationResults = null;

    try {
        ipLocationResults = yield call(getIpLocation);
    } catch (e) {
        console.log(e);
    }

    let location = null;
    if (ipLocationResults) {
        try {
            location = yield call(
                api.user.getLocation,
                null,
                ipLocationResults.latitude,
                ipLocationResults.longitude
            );
            location = location.data;
        } catch (e) {
            console.log(e);
        }
    }

    yield put(receiveLocation(location));
}

/*******************************************************************
 * Request Location
 ********************************************************************/

export function* requestLocation(data) {
    let location = null;

    try {
        location = yield call(api.user.getLocation, data.data);
        location = location.data;
    } catch (e) {
        console.log(e);
    }

    yield put(receiveLocation(location));
}

/*******************************************************************
 * Watchers
 ********************************************************************/
export function* watchIPRequestLocationInfo() {
    yield takeEvery(REQUEST_IP_LOCATION_INFO, requestIpLocation);
}

export function* watchRequestLocation() {
    yield takeEvery(REQUEST_LOCATION, requestLocation);
}
