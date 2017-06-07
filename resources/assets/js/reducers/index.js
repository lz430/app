import * as ActionTypes from 'actiontypes/index';
import R from 'ramda';
import util from 'src/util';

const reducer = (state, action) => {
    switch (action.type) {
        case ActionTypes.RECEIVE_MAKES:
            return Object.assign({}, state, {
                makes: action.data.data.data,
            });
        case ActionTypes.RECEIVE_DEALS:
            return Object.assign({}, state, {
                fuelTypes: action.data.data.meta.fuelTypes,
                deals: action.data.data.data,
                dealsPagination: action.data.data.meta.pagination,
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
        case ActionTypes.RECEIVE_BODY_STYLES:
            return Object.assign({}, state, {
                bodyStyles: action.data.data.data,
            });
        case ActionTypes.TOGGLE_STYLE:
            return Object.assign({}, state, {
                selectedStyles: action.selectedStyles,
            });
        case ActionTypes.TOGGLE_FUEL_TYPE:
            return Object.assign({}, state, {
                selectedFuelTypes: action.selectedFuelTypes,
            });
        case ActionTypes.CHOOSE_TRANSMISSION_TYPE:
            return Object.assign({}, state, {
                selectedTransmissionType: action.selectedTransmissionType,
            });
    }

    return state;
};

export default reducer;
