import api from 'src/api';
import * as ActionTypes from 'actiontypes/index';

export function getMakes() {
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

export function selectMake(make_id) {
    return {
        type: ActionTypes.SELECT_MAKE,
        make_id,
    }
}

export function getDeals() {
    api.getDeals().then((data) => {
        dispatch({
            type: ActionTypes.RECEIVE_MAKES,
            data: data,
        })
    });

    return {
        type: ActionTypes.GET_DEALS,
    }
}

export function sortDeals() {
    return {
        type: ActionTypes.SORT_DEALS,
    }
}

