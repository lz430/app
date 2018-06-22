import { fork, all } from 'redux-saga/effects';

import * as BrowseSagas from 'pages/filter/sagas';
import * as DealSagas from 'sagas/deal';

export default function* root() {
    yield all([
        fork(BrowseSagas.watchRequestSearch),
        fork(DealSagas.watchDealQuote),
        fork(DealSagas.watchRequestQuoteRefresh),
    ]);
}
