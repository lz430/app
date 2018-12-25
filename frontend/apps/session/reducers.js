import * as ActionTypes from './consts';

const initialState = {};

const reducer = function(state = initialState, action = {}) {
    switch (action.type) {
        case ActionTypes.SOFT_UPDATE_SESSION_DATA:
            return {
                ...state,
                ...action.data,
            };

        default:
            return state;
    }
};

export default reducer;
