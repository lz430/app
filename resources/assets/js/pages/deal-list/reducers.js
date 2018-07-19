import { persistReducer } from 'redux-persist';
import { basePersistConfig } from 'persist';

import * as ActionTypes from './consts';

const initialState = {
    isLoading: false,
    page: 1,
    searchQuery: {
        entity: 'model', // deal or model depending on the page we're on.
        sort: {
            attribute: 'price',
            direction: 'asc',
        },
        filters: [],
    },
    modelYears: [],
    deals: [],
    loadingSearchResults: true,
    meta: {},
    filters: {},
    showMakeSelectorModal: null, // null = never shown | true = showing | false = has shown
    smallFiltersShown: false,
};

const persistConfig = {
    ...basePersistConfig,
    key: 'dealList',
    blacklist: [
        'isLoading',
        'deals',
        'dealPage',
        'dealPageTotal',
        'modelYears',
        'loadingSearchResults',
        'page',
        'meta',
        'filters',
        'smallFiltersShown',
    ],
};

const reducer = function(state = initialState, action = {}) {
    switch (action.type) {
        case ActionTypes.SEARCH_SET_FILTERS:
            return {
                ...state,
                searchQuery: {
                    ...state.searchQuery,
                    filters: action.filters,
                },
            };
        case ActionTypes.SEARCH_INCREMENT_PAGE:
            return {
                ...state,
                page: state.page + 1,
                searchQuery: {
                    ...state.searchQuery,
                },
            };
        case ActionTypes.SEARCH_REQUEST:
            return {
                ...state,
            };

        case ActionTypes.SEARCH_RECEIVE:
            if (!action.data) {
                return state;
            }

            return {
                ...state,
                meta: action.data.meta,
                filters: action.data.filters,
            };

        case ActionTypes.SEARCH_LOADING_START:
            return {
                ...state,
                loadingSearchResults: true,
            };

        case ActionTypes.SEARCH_LOADING_FINISHED:
            return {
                ...state,
                loadingSearchResults: false,
            };

        case ActionTypes.RECEIVE_DEALS:
            let deals = [];

            if (state.page !== 1) {
                deals.push(...state.deals);
            }

            deals.push(...action.data.results);

            return {
                ...state,
                deals: deals,
            };

        case ActionTypes.RECEIVE_MODEL_YEARS:
            return {
                ...state,
                modelYears: action.data.results,
            };

        case ActionTypes.SEARCH_RESET:
            return {
                ...state,
                page: 1,
                showMakeSelectorModal: true,
                searchQuery: {
                    ...state.searchQuery,
                    entity: 'model',
                },
                deals: [],
                modelYears: [],
            };

        case ActionTypes.CLEAR_MODEL_YEAR:
            return {
                ...state,
                page: 1,
                searchQuery: {
                    ...state.searchQuery,
                    entity: 'model',
                    models: [],
                    years: [],
                },
                deals: [],
            };

        case ActionTypes.SELECT_MODEL_YEAR:
            return {
                ...state,
                page: 1,
                searchQuery: {
                    ...state.searchQuery,
                    entity: 'deal',
                    filters: [
                        ...state.searchQuery.filters,
                        'model:' + action.data.model,
                        'year:' + action.data.year,
                    ],
                },
            };

        case ActionTypes.SEARCH_CHANGE_SORT:
            let current = state.searchQuery.sort.direction;
            let direction = 'asc';

            if (current === 'asc') {
                direction = 'desc';
            }

            return {
                ...state,
                deals: [],
                page: 1,
                searchQuery: {
                    ...state.searchQuery,
                    sort: {
                        attribute: action.sort,
                        direction: direction,
                    },
                },
            };

        case ActionTypes.SEARCH_SET_ENTITY:
            return {
                ...state,
                deals: [],
                modelYears: [],
                page: 1,
                searchQuery: {
                    ...state.searchQuery,
                    entity: action.entity,
                },
            };

        case ActionTypes.TOGGLE_SMALL_FILTERS_SHOWN:
            return {
                ...state,
                smallFiltersShown: !state.smallFiltersShown,
            };
        case ActionTypes.MAKE_SELECTOR_MODAL_OPEN:
            return {
                ...state,
                showMakeSelectorModal: true,
            };
        case ActionTypes.MAKE_SELECTOR_MODAL_CLOSE:
            return {
                ...state,
                showMakeSelectorModal: false,
            };

        default:
            return state;
    }
};

export default persistReducer(persistConfig, reducer);
