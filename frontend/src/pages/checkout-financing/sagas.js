import { takeEvery, select, put, call } from 'redux-saga/effects';

import { initPage } from '../../apps/page/sagas';

import { INIT } from './consts';
import { checkout as getCheckout } from '../../apps/checkout/selectors';
import { track } from '../../services';
import { pageLoadingFinished, pageLoadingStart } from '../../apps/page/actions';
import ApiClient from '../../store/api';
import { receiveFinancingUrl } from './actions';

/*******************************************************************
 * Init
 ********************************************************************/
function* init() {
    yield put(pageLoadingStart());
    yield* initPage('checkout-financing', false);
    const checkout = yield select(getCheckout);

    let results = null;

    try {
        results = yield call(
            ApiClient.checkout.getFinancing,
            checkout.purchase.id,
            checkout.userToken
        );
        results = results.data;
    } catch (e) {
        console.log(e);
    }

    yield put(receiveFinancingUrl(results));
    yield put(pageLoadingFinished());

    if (checkout.deal.id) {
        track('checkout:financing:view', {
            'Deal Make': checkout.deal.make,
            'Deal Model': checkout.deal.model,
            'Deal Year': checkout.deal.year,
            'Deal Style': checkout.deal.style,
            'Deal Version Name': checkout.deal.version.name,
            'Customer Role':
                checkout.role === 'dmr' ? 'default' : checkout.role,
            'Customer Conditional Roles': checkout.quote.meta.conditionalRoles,
            'Purchase Strategy': checkout.strategy,
        });
    }
}

/*******************************************************************
 * Watchers
 ********************************************************************/

export function* watchInit() {
    yield takeEvery(INIT, init);
}
