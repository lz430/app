import * as ActionTypes from './consts';

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
