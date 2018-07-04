import * as ActionTypes from './consts';
import util from 'src/util';

export function requestSearch() {
    return {
        type: ActionTypes.SEARCH_REQUEST,
    };
}

export function receiveSearch(results) {
    return {
        type: ActionTypes.SEARCH_RECEIVE,
        data: results,
    };
}

export function initDealListData() {
    return {
        type: ActionTypes.INIT,
    };
}

export function toggleSearchFilter(category, item) {
    return {
        type: ActionTypes.SEARCH_TOGGLE_FILTER,
        category: category,
        item: item,
    };
}

export function setSearchFilters(filters) {
    return {
        type: ActionTypes.SEARCH_SET_FILTERS,
        filters: filters,
    };
}

export function clearAllFilters() {
    return (dispatch, getState) => {
        dispatch({
            type: ActionTypes.CLEAR_ALL_FILTERS,
        });

        dispatch({
            type: ActionTypes.SEARCH_REQUEST,
        });
    };
}

export function receiveDeals(data) {
    return dispatch => {
        dispatch({
            type: ActionTypes.RECEIVE_DEALS,
            data: data,
        });
    };
}

export function requestMoreDeals() {
    return dispatch => {
        dispatch({
            type: ActionTypes.SEARCH_INCREMENT_PAGE,
        });

        dispatch({
            type: ActionTypes.SEARCH_REQUEST,
        });
    };
}

export function receiveModelYears(data) {
    return {
        type: ActionTypes.RECEIVE_MODEL_YEARS,
        data: data,
    };
}

export function clearModelYear() {
    return dispatch => {
        dispatch({
            type: ActionTypes.CLEAR_MODEL_YEAR,
        });

        dispatch({
            type: ActionTypes.SEARCH_REQUEST,
        });
    };
}

export function selectModelYear(vehicleModel) {
    return dispatch => {
        dispatch({
            type: ActionTypes.SELECT_MODEL_YEAR,
            data: vehicleModel,
        });

        dispatch({
            type: ActionTypes.SEARCH_REQUEST,
        });
    };
}

export function toggleSearchSort(sort) {
    return dispatch => {
        dispatch({
            type: ActionTypes.SEARCH_CHANGE_SORT,
            sort,
        });

        dispatch({
            type: ActionTypes.SEARCH_REQUEST,
        });
    };
}
