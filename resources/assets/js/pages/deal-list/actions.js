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

export function receiveFeatures(data) {
    return {
        type: ActionTypes.RECEIVE_FEATURES,
        data: data,
    };
}

export function receiveFeatureCategories(data) {
    return {
        type: ActionTypes.RECEIVE_FEATURE_CATEGORIES,
        data: data,
    };
}

export function toggleStyle(style) {
    return (dispatch, getState) => {
        const selectedStyles = util.toggleItem(
            getState().pages.dealList.searchQuery.styles,
            style
        );

        dispatch({
            type: ActionTypes.TOGGLE_STYLE,
            selectedStyles: selectedStyles,
        });

        dispatch({
            type: ActionTypes.SEARCH_REQUEST,
        });
    };
}

export function chooseYear(year) {
    return (dispatch, getState) => {
        const selectedYear =
            getState().pages.dealList.selectedYear === year ? null : year;

        dispatch({
            type: ActionTypes.CHOOSE_YEAR,
            selectedYear,
        });

        dispatch({
            type: ActionTypes.SEARCH_REQUEST,
        });
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

export function toggleFeature(feature) {
    return (dispatch, getState) => {
        const selectedFeatures = util.toggleItem(
            getState().pages.dealList.searchQuery.features,
            feature
        );

        dispatch({
            type: ActionTypes.TOGGLE_FEATURE,
            selectedFeatures,
        });

        dispatch({
            type: ActionTypes.SEARCH_REQUEST,
        });
    };
}

export function toggleMake(name) {
    return (dispatch, getState) => {
        const selectedMakes = util.toggleItem(
            getState().pages.dealList.searchQuery.makes,
            name
        );

        dispatch({
            type: ActionTypes.TOGGLE_MAKE,
            selectedMakes,
        });

        dispatch({
            type: ActionTypes.SEARCH_REQUEST,
        });
    };
}

export function toggleModel(model) {
    return (dispatch, getState) => {
        const selectedModels = util.toggleItem(
            getState().pages.dealList.searchQuery.models,
            model
        );

        dispatch({
            type: ActionTypes.TOGGLE_MODEL,
            selectedModels,
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
