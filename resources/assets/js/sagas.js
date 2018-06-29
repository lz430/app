import { fork, all } from 'redux-saga/effects';

import * as DealListSagas from 'pages/deal-list/sagas';
import * as DealDetailSagas from 'pages/deal-detail/sagas';
import * as CompareSagas from 'pages/compare/sagas';
import * as AppUserSagas from 'apps/user/sagas';
import * as AppPricingSagas from 'apps/pricing/sagas';

export default function* root() {
    yield all([
        fork(DealListSagas.watchInit),
        fork(DealListSagas.watchRequestSearch),
        fork(DealDetailSagas.watchInit),
        fork(CompareSagas.watchInit),
        fork(AppUserSagas.watchIPRequestLocationInfo),
        fork(AppUserSagas.watchRequestLocation),
        fork(AppPricingSagas.watchRequestDealQuote),
        fork(AppPricingSagas.watchBatchRequestDealQuote),
    ]);
}
