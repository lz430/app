import { put, call, select, takeEvery } from 'redux-saga/effects';

import api from '../../store/api';

import {
    REQUEST_IP_LOCATION_INFO,
    REQUEST_LOCATION,
    LOGIN_USER,
    UPDATE_USER,
    LOGOUT_USER,
} from './consts';
import { receiveLocation } from './actions';
import { getUserLocation } from './selectors';

import { getCurrentPage } from '../../apps/page/selectors';
import { requestSearch } from '../../modules/deal-list/actions';
import { storeSessionData, clearSessionData } from '../session/manager';
import {
    softUpdateSessionData,
    softRemoveUserFromSession,
} from '../session/actions';
import { setCookie, destroyCookie } from 'nookies';

import Router from 'next/router';
import { getSessionCSRFToken } from '../session/selectors';

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
    const csrfToken = yield select(getSessionCSRFToken);

    try {
        location = yield call(api.user.getLocation, data.data);
        location = location.data;
        newData = {
            latitude: location.location.latitude,
            longitude: location.location.longitude,
            zipcode: location.location.zip,
            city: location.location.city,
            state: location.location.state,
            has_results: location.has_results,
            is_valid: true,
        };
        location = newData;
    } catch (e) {
        location = {
            is_valid: false,
            has_results: false,
        };
    }
    storeSessionData({ location: location }, data.session, csrfToken);
    yield put(softUpdateSessionData({ location: location }));

    //
    // TODO: This is going to get sketchy long term.
    const currentPage = yield select(getCurrentPage);
    if (currentPage === 'deal-list') {
        yield put(requestSearch());
    }
}

/*******************************************************************
 * Login
 ********************************************************************/

export function* loginUser(data) {
    const values = data.values;
    const formActions = data.actions;
    const csrfToken = yield select(getSessionCSRFToken);
    let token, user;

    //
    // Log User In
    try {
        token = yield call(api.user.login, values.email, values.password);
        token = token.data;
    } catch (error) {
        console.log(error);
        const formErrors = api.translateApiErrors(error.response.data);

        if (formErrors.form) {
            formActions.handleGlobalFormErrors(formErrors);
        } else {
            formActions.setErrors(formErrors);
        }

        formActions.setSubmitting(false);
    }

    //
    // Store the token in a cookie
    if (token && token['access_token']) {
        setCookie(null, 'token', token['access_token'], {
            maxAge: 30 * 24 * 60 * 60,
            path: '/',
        });
    }

    //
    // Fetch User
    if (token && token['access_token']) {
        try {
            user = yield call(api.user.me);
            user = user.data;
        } catch (error) {
            formActions.handleGlobalFormErrors({
                globalFormError: 'Unable to fetch user',
            });
            formActions.setSubmitting(false);
        }
    }

    if (user && token) {
        formActions.handleOnSuccess();
    }

    //
    // Store the user in the session
    if (user) {
        storeSessionData({ user: user }, null, csrfToken);
    }

    //
    // Soft update the session
    if (user) {
        yield put(softUpdateSessionData({ user: user }));
    }

    //
    // Redirect to my account for testing
    formActions.setSubmitting(false);
    if (token && user) {
        Router.push('/auth/my-account', 'my-account');
    }
}

export function* logoutUser() {
    const csrfToken = yield select(getSessionCSRFToken);

    //
    // Delete tokens from API
    try {
        yield call(api.user.logout);
    } catch (error) {
        console.log(error);
    }

    //
    // Delete cookie
    destroyCookie({}, 'token');

    //
    // Delete session
    clearSessionData(null, csrfToken);

    //
    // Soft delete session
    yield put(softRemoveUserFromSession());

    //
    // Redirect to homepage or something
    Router.push('/auth/login', 'login');
}

export function* updateUser(data) {
    const values = data.values;
    const formActions = data.actions;
    const csrfToken = yield select(getSessionCSRFToken);

    let user;

    //
    // Update User
    try {
        user = yield call(api.user.update, values);
        user = user.data;
    } catch (error) {
        console.log(error);
        const formErrors = api.translateApiErrors(error.response.data);

        if (formErrors.form) {
            formActions.handleGlobalFormErrors(formErrors);
        } else {
            formActions.setErrors(formErrors);
        }

        formActions.setSubmitting(false);
    }

    if (user) {
        formActions.handleOnSuccess();
    }

    //
    // Store the user in the session
    if (user) {
        storeSessionData({ user: user }, null, csrfToken);
    }

    //
    // Soft update the session
    if (user) {
        yield put(softUpdateSessionData({ user: user }));
    }

    //
    // Redirect to my account for testing
    formActions.setSubmitting(false);
    if (user) {
        Router.push('/auth/my-account', 'my-account');
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

export function* watchLogin() {
    yield takeEvery(LOGIN_USER, loginUser);
}

export function* watchLogout() {
    yield takeEvery(LOGOUT_USER, logoutUser);
}

export function* watchUpdateUser() {
    yield takeEvery(UPDATE_USER, updateUser);
}
