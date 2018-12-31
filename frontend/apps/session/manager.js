import api from '../../store/api';

/**
 *
 * @param data
 * @param session
 * @param csrfToken
 */
export const storeSessionData = (data, session, csrfToken) => {
    if (session) {
        Object.keys(data).map(key => {
            session[key] = data[key];
        });
    } else {
        api.user.setSession(data, csrfToken);
    }
};

/**
 *
 * @param session
 * @param csrfToken
 */
export const clearSessionData = (session, csrfToken) => {
    if (session) {
        session.destroy();
    } else {
        api.user.destroySession(csrfToken);
    }
};
