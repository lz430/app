import * as ActionTypes from 'apps/common/consts';
import R from 'ramda';
import util from 'src/util';

const initialState = {
    compareList: [],
    employeeBrand: false,
    fallbackLogoImage: '/images/dmr-logo-small.svg',
    selectedDeal: null,
    infoModalIsShowingFor: null,
    showMakeSelectorModal: true,
    smallFiltersShown: false,
    vehicleModel: null,
    vehicleYear: null,
    window: { width: window.innerWidth },
    dealsIdsWithCustomizedQuotes: [],
};

const reducer = (state = initialState, action) => {
    switch (action.type) {
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

        case ActionTypes.SELECT_REBATE:
            if (!R.contains(action.rebate, state.selectedRebates)) {
                return Object.assign({}, state, {
                    selectedRebates: util.toggleItem(
                        state.selectedRebates,
                        action.rebate
                    ),
                });
            }

            return state;

        case ActionTypes.SELECT_DEAL:
            return Object.assign({}, state, {
                selectedDeal: action.selectedDeal,
                dealsIdsWithCustomizedQuotes: R.union(
                    state.dealsIdsWithCustomizedQuotes,
                    [action.selectedDeal.version.jato_vehicle_id]
                ),
            });
        case ActionTypes.TOGGLE_COMPARE:
            return {
                ...state,
                compareList: action.compareList,
            };

        case ActionTypes.SHOW_INFO_MODAL:
            return {
                ...state,
                infoModalIsShowingFor: action.dealId,
            };
        case ActionTypes.HIDE_INFO_MODAL:
            return {
                ...state,
                infoModalIsShowingFor: null,
            };
    }

    return state;
};

export default reducer;
