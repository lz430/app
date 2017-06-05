import * as ActionTypes from 'actiontypes/index';
import R from 'ramda';

const reducer = (state, action) => {
    switch (action.type) {
        case ActionTypes.RECEIVE_MAKES: return Object.assign({}, state, {
            makes: action.data.data.data,
        });
        case ActionTypes.RECEIVE_DEALS: return Object.assign({}, state, {
            deals: action.data.data.data,
        });
        case ActionTypes.TOGGLE_MAKE: return Object.assign({}, state, {
            selectedMakes: R.contains(action.make_id, state.selectedMakes)
                ? R.reject(R.equals(action.make_id), state.selectedMakes)
                : R.append(action.make_id, state.selectedMakes),
        })
    }

    return state;
};

export default reducer;