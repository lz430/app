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
    return (dispatch, getState) => {
        const selectedMakes = util.toggleItem(getState().selectedMakes, make_id);

        api
            .getDeals({
                makeIds: selectedMakes,
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
            type: ActionTypes.TOGGLE_MAKE,
            selectedMakes,
        });
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
                fuelTypes: getState().selectedFuelTypes,
                transmissionType: getState().selectedTransmissionType,
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

export function toggleFuelType(fuelType) {
    return (dispatch, getState) => {
        const selectedFuelTypes = util.toggleItem(getState().selectedFuelTypes, fuelType);

        api
            .getDeals({
                makeIds: getState().selectedMakes,
                bodyStyles: getState().selectedStyles,
                fuelTypes: selectedFuelTypes,
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
            type: ActionTypes.TOGGLE_FUEL_TYPE,
            selectedFuelTypes: selectedFuelTypes,
        });
    };
}

export function chooseTransmissionType(transmissionType) {
    return (dispatch, getState) => {
        const selectedTransmissionType = getState().selectedTransmissionType === transmissionType
            ? null
            : transmissionType;

        api
            .getDeals({
                makeIds: getState().selectedMakes,
                bodyStyles: getState().selectedStyles,
                fuelTypes: getState().selectedFuelTypes,
                transmissionType: selectedTransmissionType,
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
            type: ActionTypes.CHOOSE_TRANSMISSION_TYPE,
            selectedTransmissionType: selectedTransmissionType,
        });
    };
}
