import * as ActionTypes from './consts';

export function initPage() {
    return {
        type: ActionTypes.INIT,
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
 * @param role
 * @returns {{type: string, deal: *, zipcode: *, paymentType: *, role: string}}
 */
export function dealDetailRequestDealQuote(
    deal,
    zipcode,
    paymentType,
    role = 'default'
) {
    // TODO: actually rename this.
    if (role === 'dmr') {
        role = 'default';
    }

    return {
        type: ActionTypes.REQUEST_DEAL_QUOTE,
        deal: deal,
        zipcode: zipcode,
        paymentType: paymentType,
        role: role,
    };
}
