import * as ActionTypes from './consts';

/**
 * @param data
 * @returns {{type: string, data: *}}
 */
export function softUpdateSessionData(data) {
    const sessionData = { ...data };
    delete sessionData['cookie'];
    delete sessionData['csrfSecret'];

    return {
        type: ActionTypes.SOFT_UPDATE_SESSION_DATA,
        data: sessionData,
    };
}

export function softRemoveUserFromSession() {
    return {
        type: ActionTypes.SOFT_REMOVE_USER_FROM_SESSION,
    };
}

export function setCSRFToken(token) {
    return {
        type: ActionTypes.SET_CSRF_TOKEN,
        data: token,
    };
}
