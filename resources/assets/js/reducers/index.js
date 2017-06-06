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
                deals: R.concat(action.data.data.data, state.deals),
                dealPage: R.min(
                    action.data.data.meta.pagination.current_page,
                    action.data.data.meta.pagination.total_pages
                ),
            });
        case ActionTypes.TOGGLE_MAKE:
            return Object.assign({}, state, {
                selectedMakes: R.contains(action.make_id, state.selectedMakes)
                    ? R.reject(R.equals(action.make_id), state.selectedMakes)
                    : R.append(action.make_id, state.selectedMakes),
            });
    }

    return state;
};

export default reducer;
