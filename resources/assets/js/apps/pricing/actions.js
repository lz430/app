import * as ActionTypes from './consts';

export function requestDealQuoteIsLoading(
    deal,
    zipcode,
    paymentType,
    role = 'default'
) {
    return {
        type: ActionTypes.REQUEST_DEAL_QUOTE_IS_LOADING,
        deal: deal,
        zipcode: zipcode,
        paymentType: paymentType,
        role: role,
    };
}

export function requestDealQuote(deal, zipcode, paymentType, role = 'default') {
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

export function receiveDealQuote(
    deal,
    zipcode,
    paymentType,
    quote,
    role = 'default'
) {
    return {
        type: ActionTypes.RECEIVE_DEAL_QUOTE,
        deal: deal,
        zipcode: zipcode,
        paymentType: paymentType,
        role: role,
        data: quote,
    };
}
