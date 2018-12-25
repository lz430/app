export const getUserLocation = state => {
    return state.session.location;
};

export const getUserZipcode = state => {
    return state.session.location.zipcode;
};

export const getUser = state => {
    return state.session.user;
};
