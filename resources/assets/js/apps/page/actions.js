import * as ActionTypes from './consts';

export function setCurrentPage(data) {
    return {
        type: ActionTypes.SET_CURRENT_PAGE,
        data: data,
    };
}
