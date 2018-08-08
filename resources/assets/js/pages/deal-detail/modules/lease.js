import { track } from '../../../services';

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

export function update(annualMileage, term, cashDue) {
    track('deal-detail:quote-form:changed', {
        'Form Property': 'Lease Configuration',
        'Form Lease Mileage': annualMileage,
        'Form Lease Term': term,
        'Form Lease Cash Due': cashDue,
    });

    return {
        type: UPDATE,
        annualMileage,
        term,
        cashDue,
    };
}
