import { fork, all } from 'redux-saga/effects'

import * as BrowseSagas from 'sagas/browse';
import * as DealSagas from 'sagas/deal';

export default function* root() {
    yield all([
        fork(BrowseSagas.watchRequestSearch),
        fork(DealSagas.watchDealQuote),
        fork(DealSagas.watchRequestQuoteRefresh)
    ])
}