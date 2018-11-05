import { fork, all } from 'redux-saga/effects';

import * as DealListSagas from '../modules/deal-list/sagas';
import * as DealDetailSagas from '../modules/deal-detail/sagas';
import * as CompareSagas from '../modules/compare/sagas';
import * as CheckoutConfirm from '../modules/checkout-confirm/sagas';
import * as CheckoutFinancing from '../modules/checkout-financing/sagas';
import * as CheckoutComplete from '../modules/checkout-complete/sagas';
import * as ContactPage from '../modules/contact/sagas';
import * as AppUserSagas from '../apps/user/sagas';
import * as AppPricingSagas from '../apps/pricing/sagas';
import * as AppCheckoutSagas from '../apps/checkout/sagas';
import * as AppPageSagas from '../apps/page/sagas';

export default function* root() {
    yield all([
        fork(DealListSagas.watchInit),
        fork(DealListSagas.watchRequestSearch),
        fork(DealListSagas.watchToggleSearchFilter),
        fork(DealDetailSagas.watchInit),
        fork(DealDetailSagas.watchRequestDealQuote),
        fork(CompareSagas.watchInit),
        fork(CheckoutConfirm.watchInit),
        fork(CheckoutFinancing.watchInit),
        fork(CheckoutComplete.watchInit),
        fork(ContactPage.watchFormSubmit),
        fork(AppUserSagas.watchIPRequestLocationInfo),
        fork(AppUserSagas.watchRequestLocation),
        fork(AppPricingSagas.watchRequestDealQuote),
        fork(AppPricingSagas.watchBatchRequestDealQuote),
        fork(AppCheckoutSagas.watchCheckoutStart),
        fork(AppCheckoutSagas.watchCheckoutContact),
        fork(AppCheckoutSagas.watchCheckoutFinancingComplete),
        fork(AppPageSagas.watchRequestAutocomplete),
    ]);
}
