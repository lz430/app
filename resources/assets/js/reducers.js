import { combineReducers } from 'redux';
import commonReducers from 'reducers/index';

import appUserReducer from 'apps/user/reducers';

import dealDetailsReducer from 'containers/dealDetails/reducer';
import dealListReducer from 'pages/deal-list/reducers';

const pagesReducer = combineReducers({
    dealDetails: dealDetailsReducer,
    dealList: dealListReducer,
});

export default combineReducers({
    common: commonReducers,
    user: appUserReducer,
    pages: pagesReducer,
});
