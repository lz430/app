import api from 'src/api';
import util from 'src/util';
import * as ActionTypes from 'actiontypes/index';

export function requestMakes() {
    return dispatch => {
        api.getMakes().then(data => {
            dispatch({
                type: ActionTypes.RECEIVE_MAKES,
                data: data,
            });
        });

        dispatch({
            type: ActionTypes.REQUEST_MAKES,
        });
    };
}

export function receiveMakes() {
    return {
        type: ActionTypes.RECEIVE_MAKES,
    };
}

export function toggleMake(make_id) {
    return {
        type: ActionTypes.TOGGLE_MAKE,
        make_id,
    };
}

export function receiveDeals() {
    return {
        type: ActionTypes.RECEIVE_DEALS,
    };
}

export function requestDeals() {
    return (dispatch, getState) => {
        api
            .getDeals({
                makeIds: getState().selectedMakes,
                bodyStyles: getState().selectedStyles,
                includes: ['photos'],
                sortColumn: getState().sortColumn,
                sortAscending: getState().sortAscending,
                page: 1,
            })
            .then(data => {
                dispatch({
                    type: ActionTypes.RECEIVE_DEALS,
                    data: data,
                });
            });

        dispatch({
            type: ActionTypes.REQUEST_DEALS,
        });
    };
}

export function requestMoreDeals() {
    return (dispatch, getState) => {
        api
            .getDeals({
                makeIds: getState().selectedMakes,
                bodyStyles: getState().selectedStyles,
                includes: ['photos'],
                sortColumn: getState().sortColumn,
                sortAscending: getState().sortAscending,
                page: getState().dealPage + 1,
            })
            .then(data => {
                dispatch({
                    type: ActionTypes.RECEIVE_MORE_DEALS,
                    data: data,
                });
            });

        dispatch({
            type: ActionTypes.REQUEST_MORE_DEALS,
        });
    };
}

export function sortDeals(sort) {
    return {
        type: ActionTypes.SORT_DEALS,
        sort,
    };
}

export function receiveBodyStyles(deals) {
    return {
        type: ActionTypes.RECEIVE_BODY_STYLES,
        data: deals,
    };
}

export function requestBodyStyles() {
    return (dispatch) => {
        api
            .getBodyStyles()
            .then(data => {
                dispatch(receiveBodyStyles(data));
            });

        dispatch({
            type: ActionTypes.REQUEST_BODY_STYLES,
        });
    };
}

export function toggleStyle(style) {
    return (dispatch, getState) => {
        const selectedStyles = util.toggleItem(getState().selectedStyles, style);

        api
            .getDeals({
                makeIds: getState().selectedMakes,
                bodyStyles: selectedStyles,
                includes: ['photos'],
                sortColumn: getState().sortColumn,
                sortAscending: getState().sortAscending,
                page: 1,
            })
            .then(data => {
                dispatch({
                    type: ActionTypes.RECEIVE_DEALS,
                    data: data,
                });
            });

        dispatch({
            type: ActionTypes.TOGGLE_STYLE,
            selectedStyles: selectedStyles,
        });
    };
}
