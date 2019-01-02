import * as ActionTypes from './consts';
import { track } from '../../core/services';

export function receiveLocation(data) {
    if (data && data['location']) {
        track('user:preference:location', {
            'Preference City': data['location']['city'],
            'Preference State': data['location']['state'],
            'Preference Zip': data['location']['zip'],
            'Preference Country': data['location']['country'],
            'Preference Has Results': data['has_results'],
        });
    }

    return {
        type: ActionTypes.RECEIVE_LOCATION,
        data: data,
    };
}

export function requestIpLocation(ip, session = null) {
    return {
        type: ActionTypes.REQUEST_IP_LOCATION_INFO,
        ip: ip,
        session: session,
    };
}

export function requestLocation(data, session = null) {
    return {
        type: ActionTypes.REQUEST_LOCATION,
        data: data,
        session: session,
    };
}

export function setPurchaseStrategy(data) {
    track('user:preference:purchaseStrategy', { 'Purchase Strategy': data });

    return {
        type: ActionTypes.SET_PURCHASE_STRATEGY,
        data: data,
    };
}

/**
 *
 * @param values
 * @param actions
 * @returns {{type: string, token: *, actions: *}}
 */
export function loginUser(values, actions) {
    return {
        type: ActionTypes.LOGIN_USER,
        values: values,
        actions: actions,
    };
}

/**
 *
 * @returns {{type: string, token: *, actions: *}}
 */
export function logoutUser() {
    return {
        type: ActionTypes.LOGOUT_USER,
    };
}

/**
 *
 * @param values
 * @param actions
 * @returns {{type: string, token: *, actions: *}}
 */
export function updateUser(values, actions) {
    return {
        type: ActionTypes.UPDATE_USER,
        values: values,
        actions: actions,
    };
}
