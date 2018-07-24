import { takeEvery } from 'redux-saga/effects';

import { initPage } from 'apps/page/sagas';

import { INIT } from './consts';

/*******************************************************************
 * Init
 ********************************************************************/
function* init() {
    yield* initPage('checkout-complete');
}

/*******************************************************************
 * Watchers
 ********************************************************************/

export function* watchInit() {
    yield takeEvery(INIT, init);
}
