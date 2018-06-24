import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

import { combineReducers } from 'redux';

import selectDiscount from './modules/selectDiscount';
import finance from './modules/finance';
import lease from './modules/lease';

const persistConfig = {
    key: 'dealDetail',
    storage: storage,
};

const reducer = combineReducers({
    selectDiscount,
    finance,
    lease,
});

export default persistReducer(persistConfig, reducer);
