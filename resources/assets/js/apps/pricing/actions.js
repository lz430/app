import * as ActionTypes from './consts';

export function requestDealQuote(deal, zipcode, paymentType) {
    return {
        type: ActionTypes.REQUEST_DEAL_QUOTE,
        deal: deal,
        zipcode: zipcode,
        paymentType: paymentType,
    };
}

export function receiveDealQuote(quote) {
    return {
        type: ActionTypes.RECEIVE_DEAL_QUOTE,
        data: quote,
    };
}
