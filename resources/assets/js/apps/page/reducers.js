import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { basePersistConfig } from 'persist';

import * as ActionTypes from './consts';

const initialState = {
    current: null,
};

const persistConfig = {
    ...basePersistConfig,
    key: 'page',
    blacklist: ['current'],
};

const reducer = function(state = initialState, action = {}) {
    switch (action.type) {
        case ActionTypes.SET_CURRENT_PAGE:
            return {
                ...state,
                current: action.data,
            };
        default:
            return state;
    }
};

export default persistReducer(persistConfig, reducer);
