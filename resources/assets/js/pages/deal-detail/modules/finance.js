import { track } from 'services';

const UPDATE_DOWN_PAYMENT = 'dmr/dealDetails.finance.UPDATE_DOWN_PAYMENT';
const UPDATE_TERM = 'dmr/dealDetails.finance.UPDATE_TERM';

const initialState = {
    downPayment: null,
    term: null,
};

export default function(state = initialState, action = {}) {
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
    track('deal-detail:quote-form:changed', {
        'Form Property': 'Finance Down Payment',
        'Form Value': downPayment,
    });

    return {
        type: UPDATE_DOWN_PAYMENT,
        downPayment,
    };
}

export function updateTerm(term) {
    track('deal-detail:quote-form:changed', {
        'Form Property': 'Finance Term',
        'Form Value': term,
    });

    return {
        type: UPDATE_TERM,
        term,
    };
}
