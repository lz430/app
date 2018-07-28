import * as ActionTypes from 'apps/common/consts';
import * as R from 'ramda';
import util from 'src/util';
import { basePersistConfig } from 'persist';
import { persistReducer } from 'redux-persist';

const initialState = {
    compareList: [],
    employeeBrand: false,
    fallbackLogoImage: '/images/dmr-logo-small.svg',
    selectedDeal: null,
    infoModalIsShowingFor: null,
    vehicleModel: null,
    vehicleYear: null,
    window: { width: window.innerWidth },
    dealsIdsWithCustomizedQuotes: [],
};

const persistConfig = {
    ...basePersistConfig,
    key: 'common',
    blacklist: ['window'],
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
    }

    return state;
};

export default persistReducer(persistConfig, reducer);
