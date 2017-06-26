import * as ActionTypes from 'actiontypes/index';
import R from 'ramda';

const reducer = (state, action) => {
    switch (action.type) {
        case ActionTypes.RECEIVE_MAKES:
            return Object.assign({}, state, {
                makes: action.data.data.data,
            });
        case ActionTypes.RECEIVE_DEALS:
            return Object.assign({}, state, {
                deals: action.data.data.data,
                dealPageTotal: action.data.data.meta.pagination.total_pages,
                dealPage: R.min(
                    action.data.data.meta.pagination.current_page,
                    action.data.data.meta.pagination.total_pages
                ),
            });
        case ActionTypes.SORT_DEALS:
            return Object.assign({}, state, {
                sortColumn: action.sort,
                sortAscending: !state.sortAscending,
            });
        case ActionTypes.RECEIVE_MORE_DEALS:
            return Object.assign({}, state, {
                deals: R.concat(state.deals, action.data.data.data),
                dealPage: R.min(
                    action.data.data.meta.pagination.current_page,
                    action.data.data.meta.pagination.total_pages
                ),
            });
        case ActionTypes.TOGGLE_MAKE:
            return Object.assign({}, state, {
                selectedMakes: action.selectedMakes,
            });
        case ActionTypes.TOGGLE_FEATURE:
            return Object.assign({}, state, {
                selectedFeatures: action.selectedFeatures,
            });
        case ActionTypes.RECEIVE_BODY_STYLES:
            return Object.assign({}, state, {
                bodyStyles: action.data.data.data,
            });
        case ActionTypes.RECEIVE_FEATURES:
            return Object.assign({}, state, {
                features: action.data.data.data,
            });
        case ActionTypes.TOGGLE_STYLE:
            return Object.assign({}, state, {
                selectedStyles: action.selectedStyles,
            });
        case ActionTypes.CHOOSE_FUEL_TYPE:
            return Object.assign({}, state, {
                selectedFuelType: action.selectedFuelType,
            });
        case ActionTypes.CHOOSE_TRANSMISSION_TYPE:
            return Object.assign({}, state, {
                selectedTransmissionType: action.selectedTransmissionType,
            });
        case ActionTypes.SELECT_DEAL:
            return Object.assign({}, state, {
                selectedDeal: action.selectedDeal,
            });
        case ActionTypes.CLEAR_SELECTED_DEAL:
            return Object.assign({}, state, {
                selectedDeal: null,
            });
        case ActionTypes.CLEAR_ALL_FILTERS:
            return Object.assign({}, state, {
                selectedStyles: [],
                selectedTransmissionType: null,
                selectedFuelType: null,
                selectedMakes: [],
                selectedFeatures: [],
            });
        case ActionTypes.TOGGLE_COMPARE:
            return Object.assign({}, state, {
                compareList: action.compareList,
            });
        case ActionTypes.SET_ZIP_CODE:
            return Object.assign({}, state, {
                zipcode: action.zipcode,
            });
        case ActionTypes.RECEIVE_FUEL_IMAGES:
            return Object.assign({}, state, {
                imagesFromFuel: action.images,
            });
        case ActionTypes.CLEAR_FUEL_IMAGES:
            return Object.assign({}, state, {
                imagesFromFuel: [],
            });
        case ActionTypes.RECEIVE_LOCATION_INFO:
            return Object.assign({}, state, {
                zipcode: action.zipcode,
                latitude: action.latitude,
                longitude: action.longitude,
            });
    }

    return state;
};

export default reducer;
