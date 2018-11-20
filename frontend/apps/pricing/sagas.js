import {
    all,
    fork,
    put,
    call,
    select,
    takeEvery,
    cancelled,
} from 'redux-saga/effects';

import ApiClient from '../../store/api';
import { cancelRequest } from '../../store/httpclient';

import { REQUEST_BATCH_DEAL_QUOTES, REQUEST_DEAL_QUOTE } from './consts';
import { receiveDealQuote, requestDealQuoteIsLoading } from './actions';
import {
    getUserLocation,
    getUserPurchaseStrategy,
} from '../../apps/user/selectors';
import { dealQuoteKey } from './helpers';

/*******************************************************************
 * Request Deal Quote
 ********************************************************************/
export function* requestDealQuote(action, store = true) {
    const source = cancelRequest();

    const deal = action.deal;
    const zipcode = action.zipcode;
    const paymentType = action.paymentType;
    const role = action.role;
    const conditionalRoles = action.conditionalRoles || [];

    if (!action.deal || !action.zipcode || !action.paymentType) {
        return;
    }

    const key = dealQuoteKey(
        deal,
        zipcode,
        paymentType,
        role,
        conditionalRoles
    );

    const state = yield select();

    if (state.pricing.quotes[key] && state.pricing.quotes[key] !== null) {
        return;
    }

    yield put(
        requestDealQuoteIsLoading(
            deal,
            zipcode,
            paymentType,
            role,
            conditionalRoles
        )
    );

    let results = null;

    let roles = [role, ...conditionalRoles];

    try {
        results = yield call(
            ApiClient.deal.dealGetQuote,
            deal.id,
            paymentType,
            zipcode,
            roles,
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

    if (store) {
        yield put(receiveDealQuote(results));
    }

    return results;
}

/**
 * Called from the search page, we always want default pricing.
 * @param deals
 * @returns {IterableIterator<*>}
 */
export function* batchRequestDealQuotes(deals) {
    const location = yield select(getUserLocation);
    const strategy = yield select(getUserPurchaseStrategy);

    if (!location.zipcode || !strategy) {
        return;
    }

    if (deals.deals) {
        deals = deals.deals;
    }

    yield all(
        deals.map(deal =>
            fork(requestDealQuote, {
                type: REQUEST_DEAL_QUOTE,
                deal: deal,
                zipcode: location.zipcode,
                paymentType: strategy,
                role: 'default',
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

export function* watchBatchRequestDealQuote() {
    yield takeEvery(REQUEST_BATCH_DEAL_QUOTES, batchRequestDealQuotes);
}
