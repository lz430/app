import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

import * as ActionTypes from './consts';

const initialState = {};

const persistConfig = {
    key: 'compare',
    storage: storage,
    blacklist: [],
};

const reducer = function(state = initialState, action = {}) {
    switch (action.type) {
        case ActionTypes.INIT:
            return state;

        default:
            return state;
    }
};

export default persistReducer(persistConfig, reducer);
