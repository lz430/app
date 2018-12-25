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
