import { persistReducer } from 'redux-persist';
import { combineReducers } from 'redux';
import { basePersistConfig } from 'persist';

import selectDiscount from './modules/selectDiscount';
import finance from './modules/finance';
import lease from './modules/lease';

import { RECEIVE_DEAL } from './consts';

const persistConfig = {
    ...basePersistConfig,
    key: 'dealDetail',
    blacklist: ['fuck', 'deal', 'selectDiscount', 'lease', 'finance'],
};

const dealReducer = function(state = null, action = {}) {
    switch (action.type) {
        case RECEIVE_DEAL:
            return action.data;

        default:
            return state;
    }
};

const reducer = combineReducers({
    deal: dealReducer,
    selectDiscount,
    finance,
    lease,
});

export default persistReducer(persistConfig, reducer);
