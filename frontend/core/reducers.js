import { combineReducers } from 'redux';
import { persistReducer } from 'redux-persist';

import { basePersistConfig } from './persist';

import commonReducers from '../apps/common/reducers';
import appUserReducer from '../apps/user/reducers';
import appPageReducer from '../apps/page/reducers';
import appPricingReducer from '../apps/pricing/reducers';
import appCheckoutReducer from '../apps/checkout/reducers';
import appSessionReducer from '../apps/session/reducers';

import dealDetailsReducer from '../modules/deal-detail/reducer';
import dealListReducer from '../modules/deal-list/reducers';
import compareReducer from '../modules/compare/reducers';
import checkoutFinancing from '../modules/checkout-financing/reducers';

const pagesReducer = combineReducers({
    dealDetails: dealDetailsReducer,
    dealList: dealListReducer,
    compare: compareReducer,
    checkoutFinancing: checkoutFinancing,
});

const pagesPersistConfig = {
    ...basePersistConfig,
    key: 'pages',
    blacklist: ['dealList', 'dealDetails', 'compare'],
};

export default combineReducers({
    common: commonReducers,
    user: appUserReducer,
    pricing: appPricingReducer,
    checkout: appCheckoutReducer,
    page: appPageReducer,
    session: appSessionReducer,
    pages: persistReducer(pagesPersistConfig, pagesReducer),
});
