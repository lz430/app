import * as ActionTypes from './consts';

export function submitContactForm(data) {
    return {
        type: ActionTypes.SUBMIT_CONTACT_FORM,
        data: data,
    };
}
