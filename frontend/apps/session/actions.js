import * as ActionTypes from './consts';

/**
 * @param data
 * @returns {{type: string, data: *}}
 */
export function softUpdateSessionData(data) {
    return {
        type: ActionTypes.SOFT_UPDATE_SESSION_DATA,
        data: data,
    };
}

export function softRemoveUserFromSession() {
    return {
        type: ActionTypes.SOFT_REMOVE_USER_FROM_SESSION,
    };
}
