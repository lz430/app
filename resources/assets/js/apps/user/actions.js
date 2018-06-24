import * as ActionTypes from './consts';
import api from '../../src/api';
import jsonp from 'jsonp';

export function checkZipInRange(code) {
    return dispatch => {
        api.checkZipInRange(code).then(data => {
            return dispatch(setZipInRange(data.data));
        });
    };
}

export function setZipInRange(data) {
    return dispatch => {
        api.setZip(data.code).then(() => {
            return dispatch({
                type: ActionTypes.SET_ZIP_IN_RANGE,
                supported: data.supported,
            });
        });

        dispatch({
            type: ActionTypes.SEARCH_REQUEST,
        });
    };
}

export function setZipCode(zipcode) {
    return (dispatch, getState) => {
        dispatch({
            type: ActionTypes.SET_ZIP_CODE,
            zipcode,
        });

        dispatch(checkZipInRange(zipcode));
    };
}

export function receiveLocationInfo(data) {
    return {
        type: ActionTypes.RECEIVE_LOCATION_INFO,
        data: data,
    };
}
