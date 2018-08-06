import { takeEvery, select } from 'redux-saga/effects';

import { initPage } from 'apps/page/sagas';

import { INIT } from './consts';
import { track } from 'services';
import { checkout as getCheckout } from 'apps/checkout/selectors';

/*******************************************************************
 * Init
 ********************************************************************/
function* init() {
    yield* initPage('checkout-complete');

    const checkout = yield select(getCheckout);
    if (checkout.deal.id) {
        track('checkout:complete:view', {
            'Deal Make': checkout.deal.make,
            'Deal Model': checkout.deal.model,
            'Deal Year': checkout.deal.year,
            'Deal Style': checkout.deal.style,
            'Deal Version Name': checkout.deal.version.name,
            'Customer Role': checkout.role,
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
