import {makeDealPricing} from "selectors/index";
import DealPricing from 'src/DealPricing';
import axios from 'axios';

import {  all, put, call, select, take, takeEvery, fork, spawn, cancelled } from 'redux-saga/effects'
import util from 'src/util';
import ApiClient from 'store/api';

import * as ActionTypes from 'actiontypes/index';
import R from "ramda";
import {receiveBestOffer, requestLeaseRates, receiveLeaseRates, receiveLeasePayments} from "actions/index";

/**
 *
 * @param deal
 * @param zipcode
 * @param paymentType
 * @param targets
 * @returns {IterableIterator<*>}
 */
function* requestDealBestOffer(deal, zipcode, paymentType, targets) {
    console.log('requestDealBestOffer');

    const bestOfferKey = util.getBestOfferKeyForDeal(deal, zipcode, paymentType, targets);

    const CancelToken = axios.CancelToken;
    const source = CancelToken.source();


    let results = null;

    try {
        results = yield call(ApiClient.dealGetQuote, deal.id, paymentType, zipcode, source.token);
    } catch (e) {
        console.log(e);
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
            console.log("Cancelled requestDealBestOffer");
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
    console.log('requestDealLeaseRates');

    const CancelToken = axios.CancelToken;
    const source = CancelToken.source();

    let results = null;

    try {
        results = yield call(ApiClient.dealGetLeaseRates, deal, zipcode, source.token);
    } catch (e) {
        console.log(e);
    } finally {
        if (yield cancelled()) {
            console.log("Cancelled requestDealLeaseRates");
            source.cancel();
        }
    }

    yield put(receiveLeaseRates(deal, zipcode, results));

    if (results && results.data.length > 0) {
        yield fork(requestDealLeasePayments, deal);
    }
}

/**
 *
 * @param deal
 * @param zipcode
 * @returns {IterableIterator<*>}
 */
function* requestDealLeasePayments(deal, zipcode) {
    console.log('requestDealLeasePayments');

    const state = yield select();
    const dealPricing = new DealPricing(makeDealPricing(state, {deal, zipcode}));

    const CancelToken = axios.CancelToken;
    const source = CancelToken.source();


    if (dealPricing.isNotLease()) {
        return;
    }

    if (dealPricing.hasNoLeaseTerms()) {
        return;
    }

    let results = null;
    try {
        results = yield call(ApiClient.dealGetLeasePayments, dealPricing, source.token).data;
    } catch (e) {
        console.log(e);
    }  finally {
        if (yield cancelled()) {
            console.log("Cancelled requestDealLeasePayments");
            source.cancel();
        }
    }

    yield put(receiveLeasePayments(dealPricing, zipcode, data));
}

/**
 * @returns {IterableIterator<*>}
 */
function* requestDealQuote(action) {
    const deal = action.deal;
    const state = yield select();
    const dealPricing = new DealPricing(makeDealPricing(state, {deal, zipcode}));

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

    // TODO Why do we bother to do this for each request?
    // shouldn't we only do this if the payment type is lease?
    yield fork(requestDealLeaseRates, deal, zipcode);
}

export function* batchRequestDealQuotes(deals) {
    yield all(deals.map(deal => fork(requestDealQuote, {
        type: ActionTypes.REQUEST_DEAL_QUOTE,
        deal: deal,
    })));
}

/**
 * @returns {IterableIterator<ForkEffect | *>}
 */
export function* watchDealQuote() {
    yield takeEvery(ActionTypes.REQUEST_DEAL_QUOTE, requestDealQuote);
}