export const getUserLocation = state => {
    return state.session.location;
};

export const getUserZipcode = state => {
    return state.session.location.zipcode;
};

export const getUser = state => {
    return state.session.user;
};

export const getSessionCSRFToken = state => {
    let token;

    if (state.session.token) {
        token = state.session.token;
    }

    if (!token && typeof document !== 'undefined') {
        const csrf = JSON.parse(document.getElementById('csrf').textContent);
        if (csrf.token) {
            token = csrf.token;
        }
    }

    if (typeof token == 'undefined') {
        token = null;
    }

    return token;
};
