import * as ActionTypes from './consts';

const initialState = {};

const reducer = function(state = initialState, action = {}) {
    switch (action.type) {
        case ActionTypes.SOFT_UPDATE_SESSION_DATA:
            return {
                ...state,
                ...action.data,
            };

        case ActionTypes.SOFT_REMOVE_USER_FROM_SESSION:
            return {
                ...state,
                user: null,
            };

        case ActionTypes.SET_CSRF_TOKEN:
            return {
                ...state,
                token: action.data,
            };

        default:
            return state;
    }
};

export default reducer;
