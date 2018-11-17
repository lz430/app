import * as ActionTypes from './consts';
import { track } from '../../core/services';

export function initPage(data) {
    return {
        type: ActionTypes.INIT,
        data: data,
    };
}

export function receiveDeal(deal) {
    return {
        type: ActionTypes.RECEIVE_DEAL,
        data: deal,
    };
}

/**
 * TODO: Figure out a better way to do this.
 * @param deal
 * @param zipcode
 * @param paymentType
 * @param primaryRole
 * @param conditionalRoles
 * @returns {{type: string, deal: *, zipcode: *, paymentType: *, role: string}}
 */
export function dealDetailRequestDealQuote(
    deal,
    zipcode,
    paymentType,
    primaryRole = 'default',
    conditionalRoles = []
) {
    // TODO: actually rename this.
    if (primaryRole === 'dmr') {
        primaryRole = 'default';
    }

    return {
        type: ActionTypes.REQUEST_DEAL_QUOTE,
        deal: deal,
        zipcode: zipcode,
        paymentType: paymentType,
        role: primaryRole,
        conditionalRoles: conditionalRoles,
    };
}

export function updateDownPayment(downPayment) {
    track('deal-detail:quote-form:changed', {
        'Form Property': 'Finance Down Payment',
        'Form Value': downPayment,
    });

    return {
        type: ActionTypes.FINANCE_UPDATE_DOWN_PAYMENT,
        downPayment,
    };
}

export function updateTerm(term) {
    track('deal-detail:quote-form:changed', {
        'Form Property': 'Finance Term',
        'Form Value': term,
    });

    return {
        type: ActionTypes.FINANCE_UPDATE_TERM,
        term,
    };
}

export function updateLease(annualMileage, term, cashDue) {
    track('deal-detail:quote-form:changed', {
        'Form Property': 'Lease Configuration',
        'Form Lease Mileage': annualMileage,
        'Form Lease Term': term,
        'Form Lease Cash Due': cashDue,
    });

    return {
        type: ActionTypes.LEASE_UPDATE,
        annualMileage,
        term,
        cashDue,
    };
}

export function selectDmrDiscount() {
    track('deal-detail:quote-form:changed', {
        'Form Property': 'Customer Role',
        'Form Value': 'default',
    });

    return {
        type: ActionTypes.SELECT_DMR_DISCOUNT,
    };
}
export function selectEmployeeDiscount(make) {
    track('deal-detail:quote-form:changed', {
        'Form Property': 'Customer Role',
        'Form Value': 'employee',
    });

    return {
        type: ActionTypes.SELECT_EMPLOYEE_DISCOUNT,
        make,
    };
}
export function selectSupplierDiscount(make) {
    track('deal-detail:quote-form:changed', {
        'Form Property': 'Customer Role',
        'Form Value': 'supplier',
    });

    return {
        type: ActionTypes.SELECT_SUPPLIER_DISCOUNT,
        make,
    };
}

export function selectConditionalRoles(roles) {
    track('deal-detail:quote-form:changed', {
        'Form Property': 'Customer Conditional Roles',
        'Form Value': roles,
    });

    return {
        type: ActionTypes.SELECT_CONDITIONAL_ROLES,
        data: roles,
    };
}

export function tradeSetValue(data) {
    return {
        type: ActionTypes.TRADE_SET_VALUE,
        data: data,
    };
}

export function tradeSetOwed(data) {
    return {
        type: ActionTypes.TRADE_SET_OWED,
        data: data,
    };
}

export function tradeSetEstimate(data) {
    return {
        type: ActionTypes.TRADE_SET_ESTIMATE,
        data: data,
    };
}
