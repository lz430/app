import { track } from 'services';

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
    if (results.meta.total) {
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

/**
 *
 * @param open
 * null: toggle
 * true: force open
 * false: force close
 *
 * @returns {{type: string}}
 */
export function toggleSmallFiltersShown(open = null) {
    return {
        type: ActionTypes.TOGGLE_SMALL_FILTERS_SHOWN,
        data: open,
    };
}
