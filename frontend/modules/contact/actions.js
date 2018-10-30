import * as ActionTypes from './consts';

export function submitContactForm(values, actions) {
    return {
        type: ActionTypes.SUBMIT_CONTACT_FORM,
        values: values,
        actions: actions,
    };
}

export function receiveContactForm(data) {
    return {
        type: ActionTypes.RECEIVE_CONTACT_FORM,
        data: data,
    };
}
