import { combineReducers } from 'redux';
import { persistReducer } from 'redux-persist';

import { basePersistConfig } from 'persist';

import commonReducers from 'apps/common/reducers';
import appUserReducer from 'apps/user/reducers';
import appPageReducer from 'apps/page/reducers';
import appPricingReducer from 'apps/pricing/reducers';

import dealDetailsReducer from 'pages/deal-detail/reducer';
import dealListReducer from 'pages/deal-list/reducers';
import compareReducer from 'pages/compare/reducers';

const pagesReducer = combineReducers({
    dealDetails: dealDetailsReducer,
    dealList: dealListReducer,
    compare: compareReducer,
});

const pagesPersistConfig = {
    ...basePersistConfig,
    key: 'pages',
    blacklist: ['dealList', 'dealDetail', 'compare'],
};

export default combineReducers({
    common: commonReducers,
    user: appUserReducer,
    pricing: appPricingReducer,
    page: appPageReducer,
    pages: persistReducer(pagesPersistConfig, pagesReducer),
});
