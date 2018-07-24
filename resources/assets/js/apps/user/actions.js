import * as ActionTypes from './consts';
import { track } from 'services';

export function receiveLocation(data) {
    console.log(data);
    //track("user:preference:location", {'value': data});

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

export function setPurchaseStrategy(data) {
    track('user:preference:purchaseStrategy', { value: data });

    return {
        type: ActionTypes.SET_PURCHASE_STRATEGY,
        data: data,
    };
}
