import { persistReducer } from 'redux-persist';
import { basePersistConfig } from '../../core/persist';

import * as ActionTypes from './consts';

const initialState = {
    deal: null,
    finance: {
        downPayment: null,
        term: null,
    },
    lease: {
        annualMileage: null,
        term: null,
        cashDue: null,
    },
    discount: {
        discountType: 'dmr',
        conditionalRoles: [],
        employeeBrand: null,
        supplierBrand: null,
    },
    cash: {},
};

const persistConfig = {
    ...basePersistConfig,
    key: 'dealDetail',
    blacklist: ['deal', 'selectDiscount', 'lease', 'finance'],
};

const reducer = function(state = initialState, action = {}) {
    switch (action.type) {
        case ActionTypes.RECEIVE_DEAL:
            return {
                ...state,
                deal: action.data,
            };

        case ActionTypes.FINANCE_UPDATE_DOWN_PAYMENT:
            return {
                ...state,
                finance: {
                    ...state.finance,
                    downPayment: action.downPayment,
                },
            };

        case ActionTypes.FINANCE_UPDATE_TERM:
            return {
                ...state,
                finance: {
                    ...state.finance,
                    term: action.term,
                },
            };

        case ActionTypes.LEASE_UPDATE:
            return {
                ...state,
                lease: {
                    ...state.lease,
                    cashDue: action.cashDue,
                    term: action.term,
                    annualMileage: action.annualMileage,
                },
            };

        case ActionTypes.SELECT_DMR_DISCOUNT:
            return {
                ...state,
                discount: {
                    ...state.discount,
                    discountType: 'dmr',
                },
            };
        case ActionTypes.SELECT_EMPLOYEE_DISCOUNT:
            return {
                ...state,
                discount: {
                    ...state.discount,
                    discountType: 'employee',
                    employeeBrand: action.make,
                },
            };
        case ActionTypes.SELECT_SUPPLIER_DISCOUNT:
            return {
                ...state,
                discount: {
                    ...state.discount,
                    discountType: 'supplier',
                    supplierBrand: action.make,
                },
            };
        case ActionTypes.SELECT_CONDITIONAL_ROLES:
            return {
                ...state,
                discount: {
                    ...state.discount,
                    conditionalRoles: action.data,
                },
            };
        default:
            return state;
    }
};

export default persistReducer(persistConfig, reducer);
