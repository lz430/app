import * as ActionTypes from './consts';

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
