import { call, select } from 'redux-saga/effects';
import { getSessionCSRFToken } from './selectors';
import api from '../../store/api';

export function* getCSRFToken() {
    let csrfToken = null;
    csrfToken = yield select(getSessionCSRFToken);
    if (!csrfToken) {
        try {
            let results = yield call(api.user.getCsrfToken);
            csrfToken = results.data.csrfToken;
        } catch (e) {
            console.log(e);
            csrfToken = null;
        }
    }

    return csrfToken;
}
