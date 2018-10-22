import { track } from '../../core/services';

import * as ActionTypes from './consts';

export function initDealListData(data) {
    return {
        type: ActionTypes.INIT,
        data: data,
    };
}

export function updateEntirePageState(data) {
    return {
        type: ActionTypes.UPDATE_ENTIRE_PAGE_STATE,
        data: data,
    };
}

export function requestSearch() {
    return {
        type: ActionTypes.SEARCH_REQUEST,
    };
}

export function receiveSearch(results) {
    if (
        results.meta &&
        results.meta.total !== null &&
        results.meta.total !== undefined
    ) {
        track('search:results:receive', {
            'Search Results Total': results.meta.total,
            'Search Results Entity': results.meta.entity,
            'Search Results Page': results.meta['current_page'],
        });
    }

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
        category: ['make', 'model', 'style'],
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
            category: ['model'],
            item: false,
        });
    };
}

export function searchReset(data = false) {
    return {
        type: ActionTypes.SEARCH_RESET,
        data: data,
    };
}

export function setSearchFilters(filters) {
    return {
        type: ActionTypes.SEARCH_SET_FILTERS,
        filters: filters,
    };
}

export function receiveDeals(data) {
    return {
        type: ActionTypes.RECEIVE_DEALS,
        data: data,
    };
}

export function requestMoreDeals() {
    return {
        type: ActionTypes.SEARCH_REQUEST,
        incrementPage: true,
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
    return {
        type: ActionTypes.SEARCH_REQUEST,
        sort: sort,
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
