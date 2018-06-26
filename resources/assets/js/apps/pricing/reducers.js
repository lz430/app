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
