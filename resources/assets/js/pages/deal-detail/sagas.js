import { takeEvery, select, put, call } from 'redux-saga/effects';
import { track } from 'services';
import ApiClient from 'store/api';

import { getUserLocation, getUserPurchaseStrategy } from 'apps/user/selectors';
import { requestDealQuote as requestDealQuoteAction } from 'apps/pricing/actions';
import { requestDealQuote } from 'apps/pricing/sagas';
import { discountType as getDiscountType } from 'apps/common/selectors';
import { initPage } from 'apps/page/sagas';
import { pageLoadingFinished, pageLoadingStart } from 'apps/page/actions';

import { INIT, REQUEST_DEAL_QUOTE } from './consts';
import { getConditionalRoles, getDeal } from './selectors';
import { receiveDeal } from './actions';

/*******************************************************************
 * Request Deal Quote
 ********************************************************************/
/**
 * Maybe there is a smarter way to do this.
 * @returns {IterableIterator<*>}
 */
function* dealDetailRequestDealQuote() {
    const deal = yield select(getDeal);
    const location = yield select(getUserLocation);
    const purchaseStrategy = yield select(getUserPurchaseStrategy);
    const discountType = yield select(getDiscountType);
    const conditionalRoles = yield select(getConditionalRoles);

    // Do the regular.
    yield* requestDealQuote(
        requestDealQuoteAction(
            deal,
            location.zipcode,
            purchaseStrategy,
            discountType,
            conditionalRoles
        )
    );
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
    }

    yield put(receiveDeal(results));

    if (results) {
        yield* dealDetailRequestDealQuote();

        const deal = yield select(getDeal);
        track('page:deal-detail:view', {
            'Deal Make': deal.make,
            'Deal Model': deal.model,
            'Deal Year': deal.year,
            'Deal Style': deal.style,
            'Deal Version Name': deal.version.name,
        });
    }

    yield put(pageLoadingFinished());
}

/*******************************************************************
 * Watchers
 ********************************************************************/
export function* watchInit() {
    yield takeEvery(INIT, init);
}

export function* watchRequestDealQuote() {
    yield takeEvery(REQUEST_DEAL_QUOTE, dealDetailRequestDealQuote);
}
