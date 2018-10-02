import { persistReducer } from 'redux-persist';
import { basePersistConfig } from 'persist';

import * as ActionTypes from './consts';

const initialState = {
    url: null,
};

const persistConfig = {
    ...basePersistConfig,
    key: 'checkoutFinancing',
    blacklist: ['url'],
};

const reducer = function(state = initialState, action = {}) {
    switch (action.type) {
        case ActionTypes.RECEIVE_FINANCING_URL:
            return {
                ...state,
                url: action.data,
            };

        default:
            return state;
    }
};

export default persistReducer(persistConfig, reducer);
