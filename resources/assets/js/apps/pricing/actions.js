import * as ActionTypes from './consts';

export function requestDealQuoteIsLoading(deal, zipcode, paymentType) {
    return {
        type: ActionTypes.REQUEST_DEAL_QUOTE_IS_LOADING,
        deal: deal,
        zipcode: zipcode,
        paymentType: paymentType,
    };
}

export function requestDealQuote(deal, zipcode, paymentType) {
    return {
        type: ActionTypes.REQUEST_DEAL_QUOTE,
        deal: deal,
        zipcode: zipcode,
        paymentType: paymentType,
    };
}

export function receiveDealQuote(deal, zipcode, paymentType, quote) {
    return {
        type: ActionTypes.RECEIVE_DEAL_QUOTE,
        deal: deal,
        zipcode: zipcode,
        paymentType: paymentType,
        data: quote,
    };
}
