import * as ActionTypes from './consts';

export function initPage() {
    return {
        type: ActionTypes.INIT,
    };
}

export function receiveCompareData(data) {
    return {
        type: ActionTypes.RECEIVE_COMPARE_DATA,
        data: data,
    };
}
