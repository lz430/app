import * as ActionTypes from './consts';

export function setCurrentPage(data) {
    return {
        type: ActionTypes.SET_CURRENT_PAGE,
        data: data,
    };
}

export function pageLoadingStart() {
    return {
        type: ActionTypes.PAGE_LOADING_START,
    };
}

export function pageLoadingFinished() {
    return {
        type: ActionTypes.PAGE_LOADING_FINISHED,
    };
}
