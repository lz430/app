import { combineReducers } from 'redux';

import commonReducers from 'apps/common/reducers';
import appUserReducer from 'apps/user/reducers';
import appPageReducer from 'apps/page/reducers';

import dealDetailsReducer from 'pages/deal-detail/reducer';
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
    blacklist: ['dealList', 'dealDetail'],
};

export default combineReducers({
    common: commonReducers,
    user: appUserReducer,
    page: appPageReducer,
    pages: persistReducer(pagesPersistConfig, pagesReducer),
});
