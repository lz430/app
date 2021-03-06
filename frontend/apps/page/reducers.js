import { persistReducer } from 'redux-persist';
import { basePersistConfig } from '../../core/persist';

import * as ActionTypes from './consts';

const initialState = {
    current: null,
    isLoading: false,
    headerAutocompleteResults: {},
};

const persistConfig = {
    ...basePersistConfig,
    key: 'page',
    blacklist: ['current', 'isLoading', 'headerAutocompleteResults'],
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
        case ActionTypes.RECEIVE_AUTOCOMPLETE:
            return {
                ...state,
                headerAutocompleteResults: action.data,
            };
        case ActionTypes.CLEAR_AUTOCOMPLETE:
            return {
                ...state,
                headerAutocompleteResults: {},
            };
        default:
            return state;
    }
};

export default persistReducer(persistConfig, reducer);
