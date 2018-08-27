import { basePersistConfig } from 'persist';
import { persistReducer } from 'redux-persist';
import storageSession from 'redux-persist/lib/storage/session';

import * as ActionTypes from './consts';
import { dealQuoteKey } from './helpers';

const initialState = {
    quotes: {},
};

const persistConfig = {
    ...basePersistConfig,
    key: 'pricing',
    storage: storageSession,
};

const reducer = function(state = initialState, action = {}) {
    switch (action.type) {
        case ActionTypes.REQUEST_DEAL_QUOTE_IS_LOADING:
            return {
                ...state,
                quotes: {
                    ...state.quotes,
                    [dealQuoteKey(
                        action.deal,
                        action.zipcode,
                        action.paymentType,
                        action.role,
                        action.conditionalRoles
                    )]: null,
                },
            };

        case ActionTypes.RECEIVE_DEAL_QUOTE:
            if (action.data === false) {
                return {
                    ...state,
                };
            }

            if (action.data.payments) {
                const leasePaymentsMatrix = {};
                for (let leasePayment of action.data.payments) {
                    if (!leasePaymentsMatrix[leasePayment.term]) {
                        leasePaymentsMatrix[leasePayment.term] = {};
                    }

                    if (
                        !leasePaymentsMatrix[leasePayment.term][
                            leasePayment.cash_due
                        ]
                    ) {
                        leasePaymentsMatrix[leasePayment.term][
                            leasePayment.cash_due
                        ] = {};
                    }

                    leasePaymentsMatrix[leasePayment.term][
                        leasePayment.cash_due
                    ][leasePayment.annual_mileage] = {
                        monthlyPayment: leasePayment.monthly_payment,
                        monthlyUseTax: leasePayment.monthly_use_tax,
                        monthlyPreTaxPayment:
                            leasePayment.monthly_pre_tax_payment,
                        totalAmountAtDriveOff:
                            leasePayment.total_amount_at_drive_off,
                    };
                }
                action.data.payments = leasePaymentsMatrix;
            }

            return {
                ...state,
                quotes: {
                    ...state.quotes,
                    [action.data.meta.key]: action.data,
                },
            };
        default:
            return state;
    }
};

export default persistReducer(persistConfig, reducer);
