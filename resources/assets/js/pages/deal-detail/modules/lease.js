const UPDATE_ANNUAL_MILEAGE = 'dmr/dealDetails.lease.UPDATE_ANNUAL_MILEAGE';
const UPDATE_CASH_DUE = 'dmr/dealDetails.lease.UPDATE_CASH_DUE';
const UPDATE_TERM = 'dmr/dealDetails.lease.UPDATE_TERM';
const UPDATE = 'dmr/dealDetails.lease.UPDATE';

const initialState = {
    cashDue: null,
    term: null,
    annualMileage: null,
};

export default function(state = initialState, action = {}) {
    switch (action.type) {
        case UPDATE_ANNUAL_MILEAGE:
            return {
                ...state,
                annualMileage: action.annualMileage,
            };
        case UPDATE_CASH_DUE:
            return {
                ...state,
                term: action.cashDue,
            };
        case UPDATE_TERM:
            return {
                ...state,
                term: action.term,
            };
        case UPDATE:
            return {
                ...state,
                cashDue: action.cashDue,
                term: action.term,
                annualMileage: action.annualMileage,
            };
        default:
            return state;
    }
}

export function updateAnnualMileage(annualMileage) {
    return {
        type: UPDATE_ANNUAL_MILEAGE,
        annualMileage,
    };
}

export function updateCashDue(cashDue) {
    return {
        type: UPDATE_CASH_DUE,
        cashDue,
    };
}

export function updateTerm(term) {
    return {
        type: UPDATE_TERM,
        term,
    };
}

export function update(annualMileage, term, cashDue) {
    return {
        type: UPDATE,
        annualMileage,
        term,
        cashDue,
    };
}
