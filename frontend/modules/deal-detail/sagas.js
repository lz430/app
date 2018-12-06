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
import { requestDealQuote } from '../../apps/pricing/sagas';
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

    if (
        tradeIn.value === 0 &&
        tradeIn.owed === 0 &&
        (purchaseStrategy !== 'lease' ||
            lease.cashDue === config.PRICING.lease.defaultLeaseDown)
    ) {
        results = yield* requestDealQuote({
            deal: deal,
            zipcode: location.zipcode,
            paymentType: purchaseStrategy,
            role: role,
            conditionalRoles: conditionalRoles,
        });
    }

    if (!results) {
        try {
            results = yield call(
                ApiClient.deal.dealGetQuote,
                deal.id,
                purchaseStrategy,
                location.zipcode,
                roles,
                source.token,
                purchaseStrategy === 'lease' && lease.cashDue
                    ? lease.cashDue
                    : config.PRICING.lease.defaultLeaseDown,
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

    const userLocation = yield select(getUserLocation);

    let results = null;

    try {
        results = yield call(
            ApiClient.deal.get,
            action.data,
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
