import { basePersistConfig } from 'persist';
import { persistReducer } from 'redux-persist';

import * as ActionTypes from './consts';

const initialState = {
    deal: {},
    quote: {},
    strategy: '', // cash | finance | lease
    role: null, // default | supplier | employee
    term: 0, // number of months for fiance or lease

    financeDownPayment: 0,
    leaseAnnualMileage: 0,
};

const persistConfig = {
    ...basePersistConfig,
    key: 'checkout',
    blacklist: [],
};

const reducer = function(state = initialState, action = {}) {
    switch (action.type) {
        case ActionTypes.SET_CHECKOUT_DATA:
            return {
                ...state,
                deal: action.deal,
                quote: action.quote,
                strategy: action.strategy,
                role: action.role,
                term: action.term,
                financeDownPayment: action.financeDownPayment,
                leaseAnnualMileage: action.leaseAnnualMileage,
            };

        default:
            return state;
    }
};

export default persistReducer(persistConfig, reducer);
