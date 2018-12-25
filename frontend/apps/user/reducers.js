import { persistReducer } from 'redux-persist';
import { basePersistConfig } from '../../core/persist';

import * as ActionTypes from './consts';

const initialState = {
    location: {
        latitude: null,
        longitude: null,
        zipcode: '',
        city: null,
        has_results: false,
        is_valid: null,
    },

    purchasePreferences: {
        strategy: 'lease', // cash | finance | lease
    },
};

const persistConfig = {
    ...basePersistConfig,
    key: 'user',
    blacklist: [],
};

const reducer = function(state = initialState, action = {}) {
    switch (action.type) {
        case ActionTypes.SET_PURCHASE_STRATEGY:
            return {
                ...state,
                purchasePreferences: {
                    ...state.purchasePreferences,
                    strategy: action.data,
                },
            };

        case ActionTypes.RECEIVE_LOCATION:
            return {
                ...state,
                location: action.data,
            };

        default:
            return state;
    }
};

export default persistReducer(persistConfig, reducer);
