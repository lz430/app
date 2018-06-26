import * as ActionTypes from './consts';

const initialState = {
    quotes: {},
};

const dealQuoteKey = (deal, zipcode, paymentType) => {
    return `${deal.id}-${paymentType}-${zipcode}`;
};

export default function(state = initialState, action = {}) {
    switch (action.type) {
        case ActionTypes.REQUEST_DEAL_QUOTE_IS_LOADING:
            return {
                ...state,
                quotes: {
                    ...state.quotes,
                    [dealQuoteKey(
                        action.deal,
                        action.zipcode,
                        action.paymentType
                    )]: null,
                },
            };

        case ActionTypes.RECEIVE_DEAL_QUOTE:
            const key = dealQuoteKey(
                action.deal,
                action.zipcode,
                action.paymentType
            );

            if (action.data === false) {
                return {
                    ...state,
                    quotes: {
                        ...state.quotes,
                        [key]: action.data,
                    },
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
                    [key]: action.data,
                },
            };
        default:
            return state;
    }
}
