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

    try {
        let results = yield call(ApiClient.brochure.contact, values);
        yield put(receiveContactForm(results));
    } catch (e) {
        if (e.response.data.errors) {
            let errors = {};

            Object.entries(e.response.data.errors).forEach(([key, value]) => {
                if (Array.isArray(value)) {
                    errors[key] = value.pop();
                } else {
                    errors[key] = value;
                }
            });
            yield call(actions.setErrors, errors);
        } else {
            yield call(actions.setErrors, { form: 'Error submitting form' });
        }
        yield call(actions.setSubmitting, false);
    }
}

/*******************************************************************
 * Watchers
 ********************************************************************/
export function* watchFormSubmit() {
    yield takeLatest(SUBMIT_CONTACT_FORM, submitContactForm);
}
