import * as ActionTypes from './consts';

export function initPage() {
    return {
        type: ActionTypes.INIT,
    };
}

export function receiveDeal(deal) {
    return {
        type: ActionTypes.RECEIVE_DEAL,
        data: deal,
    };
}
