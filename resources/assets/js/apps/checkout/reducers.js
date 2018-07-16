import { basePersistConfig } from 'persist';
import { persistReducer } from 'redux-persist';

import * as ActionTypes from './consts';

const initialState = {
    isLoading: false, // Used throughout the checkout process to check state and whatnot.

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
    blacklist: ['isLoading'],
};

const reducer = function(state = initialState, action = {}) {
    switch (action.type) {
        case ActionTypes.CHECKOUT_IS_LOADING:
            return {
                ...state,
                isLoading: true,
            };

        case ActionTypes.CHECKOUT_IS_FINISHED_LOADING:
            return {
                ...state,
                isLoading: false,
            };

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
                employeeBrand: action.employeeBrand,
                supplierBrand: action.supplierBrand,
            };

        default:
            return state;
    }
};

export default persistReducer(persistConfig, reducer);
