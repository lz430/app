import { combineReducers } from 'redux'

import selectDiscount from './modules/selectDiscount'
import finance from './modules/finance'
import lease from './modules/lease'

export default combineReducers({
    selectDiscount,
    finance,
    lease
});