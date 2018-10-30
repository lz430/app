import { takeLatest } from 'redux-saga/effects';
import { SUBMIT_CONTACT_FORM } from './consts';

import { track } from '../../core/services';

/*******************************************************************
 * Submit Contact Form
 ********************************************************************/
function* submitContactForm() {
    yield console.log('Submit contact form');
}

/*******************************************************************
 * Watchers
 ********************************************************************/
export function* watchFormSubmit() {
    yield takeLatest(SUBMIT_CONTACT_FORM, submitContactForm);
}
