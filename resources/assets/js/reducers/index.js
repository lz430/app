import * as ActionTypes from 'actiontypes/index';
import R from 'ramda';
import { REHYDRATE } from 'redux-persist/constants';
import util from 'src/util';

const reducer = (state, action) => {
    switch (action.type) {
        case REHYDRATE:
            /**
             * If the state is a different "shape"/schema we need to let them restart
             */
            if (!util.sameStateSchema(state, action.payload)) {
                localStorage.clear();

                return state;
            }

            /**
             * If the referrer is the home page, we should not rehydrate but let them "restart".
             */
            if (util.wasReferredFromHomePage()) {
                localStorage.clear();

                return state;
            }

            return Object.assign({}, state, action.payload);
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
        case ActionTypes.RECEIVE_DEAL_REBATES:
            let nextDealRebates = Object.assign({}, state.dealRebates);

            nextDealRebates[action.data.dealId] = action.data.data.data.rebates;

            return Object.assign({}, state, {
                dealRebates: nextDealRebates,
            });
        case ActionTypes.SORT_DEALS:
            return Object.assign({}, state, {
                sortColumn: action.sort,
                sortAscending: !state.sortAscending,
            });
        case ActionTypes.SELECT_TAB:
            return Object.assign({}, state, {
                selectedTab: action.data,
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
                city: null,
            });
        case ActionTypes.RECEIVE_LOCATION_INFO:
            return Object.assign({}, state, {
                zipcode: action.zipcode,
                city: action.city,
            });
    }

    return state;
};

export default reducer;
