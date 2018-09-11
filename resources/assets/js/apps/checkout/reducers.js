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
    contactFormErrors: {},
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
            const { type, ...checkoutData } = action;
            return {
                ...state,
                ...checkoutData,
            };

        case ActionTypes.SET_CHECKOUT_CONTACT_FORM_ERRORS:
            return {
                ...state,
                contactFormErrors: action.errors,
            };

        case ActionTypes.CLEAR_CHECKOUT_CONTACT_FORM_ERRORS:
            return {
                ...state,
                contactFormErrors: {},
            };

        default:
            return state;
    }
};

export default persistReducer(persistConfig, reducer);
