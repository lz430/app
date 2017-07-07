import * as ActionTypes from 'actiontypes/index';
import R from 'ramda';
import { REHYDRATE } from 'redux-persist/constants';
import util from 'src/util';

const reducer = (state, action) => {
    switch (action.type) {
        case REHYDRATE:
            /**
             * If the referrer is the home page, we should not rehydrate but let them "restart".
             */
            if (util.wasReferredFromHomePage()) {
                return state;
            }

            /**
             * If there is a style specified in the URL we should rehydrate with that style selected.
             * So as not to confuse people coming from a specific link.
             */
            return Object.assign({}, state, action.payload, {
                selectedStyles: [util.getInitialBodyStyleFromUrl()],
            });
        case ActionTypes.WINDOW_RESIZE:
            return Object.assign({}, state, {
                window: action.window,
                smallFiltersShown: util.windowIsLargerThanSmall(
                    action.window.width
                )
                    ? false
                    : state.smallFiltersShown,
            });
        case ActionTypes.TOGGLE_SMALL_FILTERS_SHOWN:
            return Object.assign({}, state, {
                smallFiltersShown: !state.smallFiltersShown,
            });
        case ActionTypes.CLOSE_MAKE_SELECTOR_MODAL:
            return Object.assign({}, state, {
                showMakeSelectorModal: false,
            });
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
        case ActionTypes.RECEIVE_FUEL_EXTERNAL_IMAGES:
            return Object.assign({}, state, {
                fuelExternalImages: action.images,
            });
        case ActionTypes.RECEIVE_FUEL_INTERNAL_IMAGES:
            return Object.assign({}, state, {
                fuelInternalImages: action.images,
            });
        case ActionTypes.CLEAR_FUEL_IMAGES:
            return Object.assign({}, state, {
                fuelExternalImages: [],
                fuelInternalImages: [],
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
