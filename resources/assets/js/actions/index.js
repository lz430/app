import api from 'src/api';
import * as ActionTypes from 'actiontypes/index';

export function requestMakes() {
    return (dispatch) => {
        api.getMakes().then((data) => {
            dispatch({
                type: ActionTypes.RECEIVE_MAKES,
                data: data,
            })
        });

        return {
            type: ActionTypes.GET_MAKES,
        }
    }
}

export function receiveMakes() {
    return {
        type: ActionTypes.RECEIVE_MAKES,
    }
}

export function toggleMake(make_id) {
    return {
        type: ActionTypes.TOGGLE_MAKE,
        make_id,
    }
}

export function receiveDeals() {
    return {
        type: ActionTypes.RECEIVE_DEALS,
    }
}

export function requestDeals() {
    return (dispatch, getState) => {
        api.getDeals({
            makeIds: getState().selectedMakes,
            bodyStyles: [getState().selectedBodyStyle],
            includes: ['photos'],
            sortColumn: getState().sortColumn,
            sortAscDesc: getState().sortAscDesc,
            page: getState().page,
        }).then((data) => {
            dispatch({
                type: ActionTypes.RECEIVE_DEALS,
                data: data,
            })
        });

        return {
            type: ActionTypes.GET_DEALS,
        }
    };
}

export function sortDeals() {
    return {
        type: ActionTypes.SORT_DEALS,
    }
}

