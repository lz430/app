import * as ActionTypes from 'apps/common/consts';
import { basePersistConfig } from 'persist';
import { persistReducer } from 'redux-persist';

const initialState = {
    compareList: [],
    employeeBrand: false,
    fallbackLogoImage: '/images/dmr-logo-small.svg',
    vehicleModel: null,
    vehicleYear: null,
    smallFiltersShown: false,
    dealsIdsWithCustomizedQuotes: [],
};

const persistConfig = {
    ...basePersistConfig,
    key: 'common',
    blacklist: ['window', 'smallFiltersShown'],
};

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case ActionTypes.TOGGLE_COMPARE:
            return {
                ...state,
                compareList: action.compareList,
            };
    }

    return state;
};

export default persistReducer(persistConfig, reducer);
