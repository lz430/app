import {
    takeEvery,
    takeLatest,
    select,
    put,
    call,
    cancelled,
} from 'redux-saga/effects';
import { track } from '../../core/services';
import ApiClient from '../../store/api';

import {
    getUserLocation,
    getUserPurchaseStrategy,
} from '../../apps/user/selectors';
import { setPurchaseStrategy } from '../../apps/user/actions';
import { initPage } from '../../apps/page/sagas';
import { pageLoadingFinished, pageLoadingStart } from '../../apps/page/actions';

import { INIT, REQUEST_DEAL_QUOTE } from './consts';

import {
    getConditionalRoles,
    getDeal,
    getDiscountType,
    getTradeIn,
    getLease,
} from './selectors';

import {
    dealDetailReceiveDealQuote,
    receiveDeal,
    setQuoteIsLoading,
    setQuoteParamsFromQuery,
} from './actions';

import { cancelRequest } from '../../store/httpclient';

import config from '../../core/config';

/*******************************************************************
 * Request Deal Quote
 ********************************************************************/
/**
 * Maybe there is a smarter way to do this.
 * @returns {IterableIterator<*>}
 */
function* dealDetailRequestDealQuote() {
    const source = cancelRequest();
    yield put(setQuoteIsLoading(true));
    const deal = yield select(getDeal);
    const location = yield select(getUserLocation);
    const purchaseStrategy = yield select(getUserPurchaseStrategy);
    let role = yield select(getDiscountType);
    const conditionalRoles = yield select(getConditionalRoles);
    const tradeIn = yield select(getTradeIn);
    const lease = yield select(getLease);

    if (role === 'dmr') {
        role = 'default';
    }

    let roles = [role, ...conditionalRoles];
    let results = null;

    const down =
        lease.cashDue === null || lease.cashDue === undefined
            ? config.PRICING.lease.defaultLeaseDown
            : lease.cashDue;

    if (!results) {
        try {
            results = yield call(
                ApiClient.deal.dealGetQuote,
                deal.id,
                purchaseStrategy,
                location.zipcode,
                roles,
                source.token,
                down,
                tradeIn.value,
                tradeIn.owed
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
    }

    yield put(dealDetailReceiveDealQuote(results));
    yield put(setQuoteIsLoading(false));
}

/*******************************************************************
 * Init
 ********************************************************************/
function* init(action) {
    yield put(pageLoadingStart());
    yield* initPage('deal-detail', false);
    const { dealId, initialQuoteParams } = action;

    if (initialQuoteParams.strategy) {
        yield put(setPurchaseStrategy(initialQuoteParams.strategy));
    }

    if (initialQuoteParams) {
        yield put(setQuoteParamsFromQuery(initialQuoteParams));
    }

    const userLocation = yield select(getUserLocation);

    let results = null;

    try {
        results = yield call(
            ApiClient.deal.get,
            dealId,
            userLocation.latitude,
            userLocation.longitude
        );
        results = results.data;
    } catch (e) {
        console.log(e);
        results = false;
    }

    yield put(receiveDeal(results));
    yield put(pageLoadingFinished());

    if (results) {
        yield* dealDetailRequestDealQuote();

        const deal = yield select(getDeal);
        track('page:deal-detail:view', {
            'Deal In Range': deal.is_in_range,
            'Deal Status': deal.status,
            'Deal Make': deal.make,
            'Deal Model': deal.model,
            'Deal Year': deal.year,
            'Deal Style': deal.style,
            'Deal Version Name': deal.version.name,
        });
    }
}

/*******************************************************************
 * Watchers
 ********************************************************************/
export function* watchInit() {
    yield takeEvery(INIT, init);
}

export function* watchRequestDealQuote() {
    yield takeLatest(REQUEST_DEAL_QUOTE, dealDetailRequestDealQuote);
}
