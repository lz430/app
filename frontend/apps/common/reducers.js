import * as ActionTypes from '../common/consts';
import { basePersistConfig } from '../../core/persist';
import { persistReducer } from 'redux-persist';

const initialState = {
    compareList: [],
};

const persistConfig = {
    ...basePersistConfig,
    key: 'common',
};

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case ActionTypes.TOGGLE_COMPARE:
            return {
                ...state,
                compareList: action.compareList,
            };
        default:
            return state;
    }
};

export default persistReducer(persistConfig, reducer);
