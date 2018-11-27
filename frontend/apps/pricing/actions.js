import * as ActionTypes from './consts';

export function requestDealQuoteIsLoading(
    deal,
    zipcode,
    paymentType,
    primaryRole = 'default',
    conditionalRoles = []
) {
    return {
        type: ActionTypes.REQUEST_DEAL_QUOTE_IS_LOADING,
        deal: deal,
        zipcode: zipcode,
        paymentType: paymentType,
        role: primaryRole,
        conditionalRoles: conditionalRoles,
    };
}

export function requestDealQuote(
    deal,
    zipcode,
    paymentType,
    primaryRole = 'default',
    conditionalRoles = [],
    down = 0,
    tradeValue = 0,
    tradeOwed = 0
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
        down: down,
        tradeValue: tradeValue,
        tradeOwed: tradeOwed,
    };
}

export function batchRequestDealQuotes(deals) {
    return {
        type: ActionTypes.REQUEST_BATCH_DEAL_QUOTES,
        deals: deals,
    };
}

export function receiveDealQuote(quote) {
    return {
        type: ActionTypes.RECEIVE_DEAL_QUOTE,
        data: quote,
    };
}
