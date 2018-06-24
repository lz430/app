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

import { REQUEST_LOCATION_INFO } from './consts';
import { receiveLocationInfo } from './actions';

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

export function* requestLocationInfo() {
    let results = null;

    try {
        results = yield call(getIpLocation);
    } catch (e) {
        console.log('ERROR');
        console.log(e);
    }

    yield put(receiveLocationInfo(results));
}

/*******************************************************************
 * Watchers
 ********************************************************************/
export function* watchRequestLocationInfo() {
    yield takeEvery(REQUEST_LOCATION_INFO, requestLocationInfo);
}
