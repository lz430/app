import * as ActionTypes from './consts';

const initialState = {
    results: null,
};

const reducer = function(state = initialState, action = {}) {
    switch (action.type) {
        case ActionTypes.RECEIVE_CONTACT_FORM:
            return {
                ...state,
                results: action.data,
            };
        default:
            return state;
    }
};

export default reducer;
