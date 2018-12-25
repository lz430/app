import { put, call, select, takeEvery } from 'redux-saga/effects';

import api from '../../store/api';

import { REQUEST_IP_LOCATION_INFO, REQUEST_LOCATION } from './consts';
import { receiveLocation } from './actions';
import { getCurrentPage } from '../../apps/page/selectors';
import { requestSearch } from '../../modules/deal-list/actions';
import { getUserLocation } from './selectors';
import { storeSessionData } from '../session/manager';
import { softUpdateSessionData } from '../session/actions';

/*******************************************************************
 * Request IP Location
 ********************************************************************/

export function* requestIpLocation() {
    // Don't get ip location if location is already set.

    const userCurrentLocation = yield select(getUserLocation);
    if (userCurrentLocation.latitude && userCurrentLocation.longitude) {
        return;
    }

    let location = null;

    try {
        location = yield call(api.user.getLocation);
        location = location.data;
    } catch (e) {
        console.log(e);
    }

    yield put(receiveLocation(location));
}

/*******************************************************************
 * Request Location
 ********************************************************************/

export function* requestLocation(data) {
    let newData;
    let location;

    try {
        location = yield call(api.user.getLocation, data.data);
        location = location.data;
        console.log(newData);
        newData = {
            latitude: location.location.latitude,
            longitude: location.location.longitude,
            zipcode: location.location.zip,
            city: location.location.city,
            state: location.location.state,
            has_results: location.location.has_results,
            is_valid: true,
        };
        location = newData;
    } catch (e) {
        location = {
            is_valid: false,
            has_results: false,
        };
    }
    storeSessionData({ location: location }, data.session);
    yield put(softUpdateSessionData({ location: location }));

    //
    // TODO: This is going to get sketchy long term.
    const currentPage = yield select(getCurrentPage);
    if (currentPage === 'deal-list') {
        yield put(requestSearch());
    }
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
