import * as ActionTypes from './consts';
import { track } from '../../core/services';

export function initPage(dealId, initialQuoteParams) {
    return {
        type: ActionTypes.INIT,
        dealId: dealId,
        initialQuoteParams: initialQuoteParams,
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

export function dealDetailResetDealQuote() {
    return {
        type: ActionTypes.RESET_DEAL_QUOTE,
    };
}

export function dealDetailRefreshDealQuote() {
    return {
        type: ActionTypes.REQUEST_DEAL_QUOTE,
    };
}

export function dealDetailReceiveDealQuote(data) {
    return {
        type: ActionTypes.RECEIVE_DEAL_QUOTE,
        data: data,
    };
}

export function updateFinanceDownPayment(downPayment) {
    track('deal-detail:quote-form:changed', {
        'Form Property': 'Finance Down Payment',
        'Form Value': downPayment,
    });

    return {
        type: ActionTypes.FINANCE_UPDATE_DOWN_PAYMENT,
        downPayment,
    };
}

export function updateFinanceTerm(term) {
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

export function setDmrDiscount() {
    track('deal-detail:quote-form:changed', {
        'Form Property': 'Customer Role',
        'Form Value': 'default',
    });

    return {
        type: ActionTypes.SET_DMR_DISCOUNT,
    };
}
export function setEmployeeDiscount(make) {
    track('deal-detail:quote-form:changed', {
        'Form Property': 'Customer Role',
        'Form Value': 'employee',
    });

    return {
        type: ActionTypes.SET_EMPLOYEE_DISCOUNT,
        make,
    };
}
export function setSupplierDiscount(make) {
    track('deal-detail:quote-form:changed', {
        'Form Property': 'Customer Role',
        'Form Value': 'supplier',
    });

    return {
        type: ActionTypes.SET_SUPPLIER_DISCOUNT,
        make,
    };
}

export function setQuoteParamsFromQuery(params) {
    let data = {
        finance: {
            downPayment: null,
            term: null,
        },
        lease: {
            annualMileage: null,
            term: null,
            cashDue: null,
        },
        discount: {
            discountType: 'dmr',
            conditionalRoles: [],
        },
    };

    if (params.lease_mileage) {
        data.lease.annualMileage = parseInt(params.lease_mileage);
    }

    if (params.lease_due) {
        data.lease.cashDue = parseInt(params.lease_due);
    }

    if (params.lease_term) {
        data.lease.term = parseInt(params.lease_term);
    }

    if (params.finance_down) {
        data.finance.downPayment = parseInt(params.finance_down);
    }

    if (params.finance_term) {
        data.finance.term = parseInt(params.finance_term);
    }

    if (params.rebates) {
        if (!Array.isArray(params.rebates)) {
            data.discount.conditionalRoles = [params.rebates];
        } else {
            data.discount.conditionalRoles = params.rebates;
        }
    }

    if (params.role) {
        data.discount.discountType = params.role;
    }
    return {
        type: ActionTypes.SET_FROM_INITIAL_QUOTE_PARAMS,
        params: data,
    };
}

export function selectConditionalRoles(roles) {
    track('deal-detail:quote-form:changed', {
        'Form Property': 'Customer Conditional Roles',
        'Form Value': roles,
    });

    return {
        type: ActionTypes.SET_CONDITIONAL_ROLES,
        data: roles,
    };
}

export function tradeSet(value, owed, estimate) {
    return {
        type: ActionTypes.TRADE_SET,
        value: value,
        owed: owed,
        estimate: estimate,
    };
}

export function setQuoteIsLoading(isLoading) {
    return {
        type: ActionTypes.SET_QUOTE_LOADING,
        data: isLoading,
    };
}
