const UPDATE_ANNUAL_MILEAGE = 'dmr/dealDetails.lease.UPDATE_ANNUAL_MILEAGE';
const UPDATE_CASH_DUE = 'dmr/dealDetails.lease.UPDATE_CASH_DUE';
const UPDATE_TERM = 'dmr/dealDetails.lease.UPDATE_TERM';
const UPDATE = 'dmr/dealDetails.lease.UPDATE';

const initialState = {
    cashDue: {},
    term: {},
    annualMileage: {},
};

function indexFor(action) {
    return `${action.dealId}.${action.zipcode}`;
}

function replaceStateForKey(state, action, key) {
    const index = indexFor(action);

    return {
        ...state,
        [key]: {
            ...state[key],
            [index]: action[key],
        },
    };
}

function replaceStateForKeys(state, action, ...keys) {
    return keys.reduce((newState, key) => {
        return replaceStateForKey(newState, action, key);
    }, state);
}

export default function(state = initialState, action = {}) {
    switch (action.type) {
        case UPDATE_ANNUAL_MILEAGE:
            return replaceStateForKey(state, action, 'annualMileage');
        case UPDATE_CASH_DUE:
            return replaceStateForKey(state, action, 'cashDue');
        case UPDATE_TERM:
            return replaceStateForKey(state, action, 'term');
        case UPDATE:
            return replaceStateForKeys(
                state,
                action,
                'annualMileage',
                'cashDue',
                'term'
            );
        default:
            return state;
    }
}

export function updateAnnualMileage(dealId, zipcode, annualMileage) {
    return {
        type: UPDATE_ANNUAL_MILEAGE,
        dealId,
        zipcode,
        annualMileage,
    };
}

export function updateCashDue(dealId, zipcode, cashDue) {
    return {
        type: UPDATE_CASH_DUE,
        dealId,
        zipcode,
        cashDue,
    };
}

export function updateTerm(dealId, zipcode, term) {
    return {
        type: UPDATE_TERM,
        dealId,
        zipcode,
        term,
    };
}

export function update(dealId, zipcode, annualMileage, term, cashDue) {
    return {
        type: UPDATE,
        dealId,
        zipcode,
        annualMileage,
        term,
        cashDue,
    };
}
