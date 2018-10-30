import { call, put, takeLatest } from 'redux-saga/effects';
import { SUBMIT_CONTACT_FORM } from './consts';
import ApiClient from '../../store/api';

import { receiveContactForm } from './actions';

/*******************************************************************
 * Submit Contact Form
 ********************************************************************/
function* submitContactForm(action) {
    const values = action.values;
    const actions = action.actions;

    let results = null;
    try {
        results = yield call(ApiClient.brochure.contact, values);
    } catch (e) {
        yield put(receiveContactForm(e.response.data));
    }

    if (results) {
        yield put(receiveContactForm(results.data));
    }

    yield call(actions.setSubmitting, false);
}

/*******************************************************************
 * Watchers
 ********************************************************************/
export function* watchFormSubmit() {
    yield takeLatest(SUBMIT_CONTACT_FORM, submitContactForm);
}
