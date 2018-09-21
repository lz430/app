import * as ActionTypes from './consts';

export function init() {
    return {
        type: ActionTypes.INIT,
    };
}

export function receiveFinancingUrl(data) {
    return {
        type: ActionTypes.RECEIVE_FINANCING_URL,
        data: data.url ? data.url : null,
    };
}
