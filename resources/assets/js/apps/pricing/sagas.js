import {
    all,
    fork,
    put,
    call,
    select,
    takeEvery,
    cancelled,
} from 'redux-saga/effects';

import ApiClient from 'store/api';
import { cancelRequest } from 'store/httpclient';

import { REQUEST_DEAL_QUOTE } from './consts';
import { receiveDealQuote, requestDealQuoteIsLoading } from './actions';
import { getUserLocation, getUserPurchaseStrategy } from 'apps/user/selectors';

/*******************************************************************
 * Request Deal Quote
 ********************************************************************/
export function* requestDealQuote(action) {
    const source = cancelRequest();

    const deal = action.deal;
    const zipcode = action.zipcode;
    const paymentType = action.paymentType;

    const key = `${deal.id}-${paymentType}-${zipcode}`;

    const state = yield select();
    if (state.pricing.quotes[key]) {
        return;
    }

    yield put(requestDealQuoteIsLoading(deal, zipcode, paymentType));

    let results = null;

    try {
        results = yield call(
            ApiClient.deal.dealGetQuote,
            deal.id,
            paymentType,
            zipcode,
            source.token
        );
        results = results.data;
    } catch (e) {
        results = false;
        console.log(e);
    } finally {
        if (yield cancelled()) {
            source.cancel();
        }
    }

    yield put(receiveDealQuote(deal, zipcode, paymentType, results));
}

export function* batchRequestDealQuotes(deals) {
    const location = yield select(getUserLocation);
    const strategy = yield select(getUserPurchaseStrategy);

    if (!location.zipcode || !strategy) {
        return;
    }

    yield all(
        deals.map(deal =>
            fork(requestDealQuote, {
                type: REQUEST_DEAL_QUOTE,
                deal: deal,
                zipcode: location.zipcode,
                paymentType: strategy,
            })
        )
    );
}

/*******************************************************************
 * Watchers
 ********************************************************************/
export function* watchRequestDealQuote() {
    yield takeEvery(REQUEST_DEAL_QUOTE, requestDealQuote);
}
