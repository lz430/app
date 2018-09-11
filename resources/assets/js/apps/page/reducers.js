import { persistReducer } from 'redux-persist';
import { basePersistConfig } from 'persist';

import * as ActionTypes from './consts';

const initialState = {
    current: null,
    isLoading: false,
};

const persistConfig = {
    ...basePersistConfig,
    key: 'page',
    blacklist: ['current', 'isLoading'],
};

const reducer = function(state = initialState, action = {}) {
    switch (action.type) {
        case ActionTypes.SET_CURRENT_PAGE:
            return {
                ...state,
                current: action.data,
            };
        case ActionTypes.PAGE_LOADING_START:
            return {
                ...state,
                isLoading: true,
            };
        case ActionTypes.PAGE_LOADING_FINISHED:
            return {
                ...state,
                isLoading: false,
            };
        default:
            return state;
    }
};

export default persistReducer(persistConfig, reducer);
