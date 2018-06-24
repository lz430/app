const UPDATE_DOWN_PAYMENT = 'dmr/dealDetails.finance.UPDATE_DOWN_PAYMENT';
const UPDATE_TERM = 'dmr/dealDetails.finance.UPDATE_TERM';

export default function(state = {}, action = {}) {
    switch (action.type) {
        case UPDATE_DOWN_PAYMENT:
            return { ...state, downPayment: action.downPayment };
        case UPDATE_TERM:
            return { ...state, term: action.term };
        default:
            return state;
    }
}

export function updateDownPayment(downPayment) {
    return {
        type: UPDATE_DOWN_PAYMENT,
        downPayment,
    };
}

export function updateTerm(term) {
    return {
        type: UPDATE_TERM,
        term,
    };
}
