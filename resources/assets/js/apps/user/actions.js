import * as ActionTypes from './consts';

export function receiveIpLocationInfo(data) {
    return {
        type: ActionTypes.RECEIVE_IP_LOCATION_INFO,
        data: data,
    };
}

export function receiveLocation(data) {
    return {
        type: ActionTypes.RECEIVE_LOCATION,
        data: data,
    };
}

export function requestLocation(data) {
    return {
        type: ActionTypes.REQUEST_LOCATION,
        data: data,
    };
}
