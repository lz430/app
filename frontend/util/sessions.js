import api from '../store/api';

export const storeSessionData = (data, session) => {
    if (session) {
        Object.keys(data).map(key => {
            session[key] = data[key];
        });
    } else {
        api.user.setSession(data);
    }
};
