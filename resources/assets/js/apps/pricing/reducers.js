import * as ActionTypes from './consts';

const initialState = {
    quotes: {},
};

export default function(state = initialState, action = {}) {
    switch (action.type) {
        case ActionTypes.RECEIVE_DEAL_QUOTE:
            if (!action.data) {
                return state;
            }
            const key = `${action.data.meta.dealId}-${
                action.data.meta.paymentType
            }-${action.data.meta.zipcode}`;

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
