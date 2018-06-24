import { makeDealPricing } from 'selectors/index';
import DealPricing from 'src/DealPricing';
import { cancelRequest } from 'store/httpclient';
import getCommon from 'apps/common/selectors';

import {
    all,
    put,
    call,
    select,
    takeEvery,
    takeLatest,
    fork,
    cancelled,
} from 'redux-saga/effects';
import util from 'src/util';
import ApiClient from 'store/api';

import * as ActionTypes from 'actiontypes/index';
import R from 'ramda';
import {
    receiveBestOffer,
    receiveLeaseRates,
    receiveLeasePayments,
} from 'actions/index';

/**
 *
 * @param deal
 * @param zipcode
 * @param paymentType
 * @param targets
 * @returns {IterableIterator<*>}
 */
function* requestDealBestOffer(deal, zipcode, paymentType, targets) {
    const bestOfferKey = util.getBestOfferKeyForDeal(
        deal,
        zipcode,
        paymentType,
        targets
    );

    const source = cancelRequest();
    let results = null;

    try {
        results = yield call(
            ApiClient.deal.dealGetQuote,
            deal.id,
            paymentType,
            zipcode,
            source.token
        );
    } catch (e) {
        results = {
            data: {
                data: {
                    cash: {
                        totalValue: 0,
                        programs: [],
                    },
                },
            },
        };
    } finally {
        if (yield cancelled()) {
            source.cancel();
        }
    }

    yield put(receiveBestOffer(results, bestOfferKey, paymentType));
}

/**
 *
 * @param deal
 * @param zipcode
 * @returns {IterableIterator<*|CallEffect>}
 */
function* requestDealLeaseRates(deal, zipcode) {
    const source = cancelRequest();

    let results = null;

    try {
        results = yield call(
            ApiClient.deal.dealGetLeaseRates,
            deal,
            zipcode,
            source.token
        );
    } catch (e) {
        console.log(e);
    } finally {
        if (yield cancelled()) {
            source.cancel();
        }
    }

    yield put(receiveLeaseRates(deal, zipcode, results));

    if (results && results.data.length > 0) {
        yield fork(requestDealLeasePayments, deal, zipcode);
    }
}

/**
 *
 * @param deal
 * @param zipcode
 * @returns {IterableIterator<*>}
 */

function* requestDealLeasePayments(deal, zipcode) {
    const state = yield select(getCommon);
    const getDealPricing = makeDealPricing();
    let data = getDealPricing(state, { deal, zipcode });
    const dealPricing = new DealPricing(data);

    const source = cancelRequest();

    if (dealPricing.isNotLease()) {
        return;
    }

    if (dealPricing.hasNoLeaseTerms()) {
        return;
    }

    let results = null;
    try {
        results = yield call(
            ApiClient.deal.dealGetLeasePayments,
            dealPricing,
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

    yield put(receiveLeasePayments(dealPricing, zipcode, results));
}

/**
 * @returns {IterableIterator<*>}
 */
function* requestDealQuote(action) {
    const deal = action.deal;
    const state = yield select(getCommon);
    const zipcode = state.zipcode;

    // TODO: Add lazy lookup

    //
    // Build Targets (Which are a jato specific term used to describe
    // optional rebates (college, etc)
    const targetKey = util.getTargetKeyForDealAndZip(deal, zipcode);

    const selectedTargetIds = state.targetsSelected[targetKey]
        ? R.map(R.prop('targetId'), state.targetsSelected[targetKey])
        : [];

    const targets = R.uniq(state.targetDefaults.concat(selectedTargetIds));

    yield fork(requestDealBestOffer, deal, zipcode, state.selectedTab, targets);

    if (state.selectedTab === 'lease') {
        yield fork(requestDealLeaseRates, deal, zipcode);
    }
}

export function* batchRequestDealQuotes(deals) {
    yield all(
        deals.map(deal =>
            fork(requestDealQuote, {
                type: ActionTypes.REQUEST_DEAL_QUOTE,
                deal: deal,
            })
        )
    );
}

function* requestQuoteRefresh() {
    const state = yield select(getCommon);
    if (state.deals && state.deals.length) {
        yield fork(batchRequestDealQuotes, state.deals);
    }
}

/**
 * @returns {IterableIterator<ForkEffect | *>}
 */
export function* watchDealQuote() {
    yield takeEvery(ActionTypes.REQUEST_DEAL_QUOTE, requestDealQuote);
}

/**
 * When the user changes payment tab.
 * @returns {IterableIterator<*>}
 */
export function* watchRequestQuoteRefresh() {
    yield takeLatest(ActionTypes.REQUEST_ALL_BEST_OFFERS, requestQuoteRefresh);
}
