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

        default:
            return state;
    }
};

export default reducer;
