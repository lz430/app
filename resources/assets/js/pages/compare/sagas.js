import { fork, put, takeEvery } from 'redux-saga/effects';

import { INIT } from './consts';
import { requestIpLocation } from '../../apps/user/sagas';
import { setCurrentPage } from '../../apps/page/actions';

/*******************************************************************
 * Init
 ********************************************************************/
function* init() {
    yield put(setCurrentPage('compare'));
    yield fork(requestIpLocation);
}

/*******************************************************************
 * Watchers
 ********************************************************************/
export function* watchInit() {
    yield takeEvery(INIT, init);
}
