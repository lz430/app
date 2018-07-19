import * as ActionTypes from './consts';

export function initDealListData() {
    return {
        type: ActionTypes.INIT,
    };
}

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

export function toggleSearchFilter(category, item) {
    return {
        type: ActionTypes.SEARCH_TOGGLE_FILTER,
        operation: 'TOGGLE',
        category: category,
        item: item,
    };
}

export function clearAllSecondaryFilters() {
    return {
        type: ActionTypes.SEARCH_TOGGLE_FILTER,
        operation: 'KEEP_CATEGORY',
        category: ['year', 'make', 'model', 'style'],
        item: false,
    };
}

export function clearModelYear() {
    return dispatch => {
        dispatch({
            type: ActionTypes.SEARCH_SET_ENTITY,
            entity: 'model',
        });

        dispatch({
            type: ActionTypes.SEARCH_TOGGLE_FILTER,
            operation: 'REMOVE_CATEGORY',
            category: ['model', 'year'],
            item: false,
        });
    };
}

export function searchReset() {
    return {
        type: ActionTypes.SEARCH_RESET,
    };
}

export function setSearchFilters(filters) {
    return {
        type: ActionTypes.SEARCH_SET_FILTERS,
        filters: filters,
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

export function openMakeSelectorModal() {
    return {
        type: ActionTypes.MAKE_SELECTOR_MODAL_OPEN,
    };
}

export function closeMakeSelectorModal() {
    return {
        type: ActionTypes.MAKE_SELECTOR_MODAL_CLOSE,
    };
}

export function toggleSmallFiltersShown() {
    return {
        type: ActionTypes.TOGGLE_SMALL_FILTERS_SHOWN,
    };
}
