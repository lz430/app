import { fork, all } from 'redux-saga/effects';

import * as DealListSagas from 'pages/deal-list/sagas';
import * as DealSagas from 'sagas/deal';
import * as AppUserSagas from 'apps/user/sagas';

export default function* root() {
    yield all([
        fork(DealListSagas.watchInit),
        fork(DealListSagas.watchRequestSearch),
        fork(DealSagas.watchDealQuote),
        fork(DealSagas.watchRequestQuoteRefresh),
        fork(AppUserSagas.watchRequestLocationInfo),
    ]);
}
