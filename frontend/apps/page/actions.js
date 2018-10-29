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

export function headerRequestAutocomplete(query) {
    return {
        type: ActionTypes.REQUEST_AUTOCOMPLETE,
        data: query,
    };
}

export function headerReceiveAutocomplete(data) {
    return {
        type: ActionTypes.RECEIVE_AUTOCOMPLETE,
        data: data,
    };
}

export function headerClearAutocompleteResults() {
    return {
        type: ActionTypes.CLEAR_AUTOCOMPLETE,
    };
}
