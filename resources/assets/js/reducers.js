import { combineReducers } from 'redux';
import commonReducers from 'reducers/index';

import appUserReducer from 'apps/user/reducers';

import dealDetailsReducer from 'containers/dealDetails/reducer';
import dealListReducer from 'pages/deal-list/reducers';
import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

const pagesReducer = combineReducers({
    dealDetails: dealDetailsReducer,
    dealList: dealListReducer,
});

const pagesPersistConfig = {
    key: 'pages',
    storage: storage,
    blacklist: ['dealList'],
};

export default combineReducers({
    common: commonReducers,
    user: appUserReducer,
    pages: persistReducer(pagesPersistConfig, pagesReducer),
});
