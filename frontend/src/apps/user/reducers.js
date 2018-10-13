import { persistReducer } from 'redux-persist';
import { basePersistConfig } from '../../persist';

import * as ActionTypes from './consts';

const initialState = {
    location: {
        latitude: null,
        longitude: null,
        zipcode: '',
        city: null,
        has_results: false,
        is_valid: false,
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
            if (action.data && action.data.location) {
                return {
                    ...state,
                    location: {
                        ...state.location,
                        latitude: action.data.location.latitude,
                        longitude: action.data.location.longitude,
                        zipcode: action.data.location.zip,
                        city: action.data.location.city,
                        state: action.data.location.state,
                        has_results: action.data.has_results,
                        is_valid: true,
                    },
                };
            } else {
                return {
                    ...state,
                    location: {
                        is_valid: false,
                        has_results: false,
                    },
                };
            }

        default:
            return state;
    }
};

export default persistReducer(persistConfig, reducer);
