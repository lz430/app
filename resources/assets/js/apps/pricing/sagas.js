import { put, call, select, takeEvery, cancelled } from 'redux-saga/effects';

import ApiClient from 'store/api';
import { cancelRequest } from 'store/httpclient';

import { REQUEST_DEAL_QUOTE } from './consts';
import { receiveDealQuote } from './actions';

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
    console.log(state);
    console.log(key);
    if (state.pricing.quotes[key]) {
        return;
    }

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
        console.log(e);
    } finally {
        if (yield cancelled()) {
            source.cancel();
        }
    }

    yield put(receiveDealQuote(results));
}

/*******************************************************************
 * Watchers
 ********************************************************************/
export function* watchRequestDealQuote() {
    yield takeEvery(REQUEST_DEAL_QUOTE, requestDealQuote);
}
