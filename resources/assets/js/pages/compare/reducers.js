import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

import * as ActionTypes from './consts';

const persistConfig = {
    key: 'compare',
    storage: storage,
    blacklist: ['cols'],
};

const initialState = {
    cols: [],
};

const reducer = function(state = initialState, action = {}) {
    switch (action.type) {
        case ActionTypes.INIT:
            return state;

        case ActionTypes.RECEIVE_COMPARE_DATA:
            if (!action.data) {
                return state;
            }

            return {
                ...state,
                cols: action.data,
            };
        default:
            return state;
    }
};

export default persistReducer(persistConfig, reducer);
