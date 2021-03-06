import { persistReducer } from 'redux-persist';
import { basePersistConfig } from '../../core/persist';

import * as ActionTypes from './consts';
import { uniq } from 'ramda';

const initialState = {
    isLoading: false,
    loadingSearchResults: true,
    page: 1,
    searchQuery: {
        entity: 'model', // deal or model depending on the page we're on.
        sort: 'payment',
        filters: [],
    },
    modelYears: [],
    deals: [],
    meta: {},
    filters: {},
    selectedMake: null, // Hacky fix for showing make on deal inventory page.
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
        case ActionTypes.UPDATE_ENTIRE_PAGE_STATE:
            return {
                ...state,
                page: action.data.page,
                searchQuery: action.data.searchQuery,
                modelYears: action.data.modelYears,
                deals: action.data.deals,
                meta: action.data.meta,
                filters: action.data.filters,
                selectedMake: action.data.selectedMake,
            };
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
            if (action.data === false) {
                return {
                    ...state,
                    deals: action.data,
                };
            }

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
            if (action.data === false) {
                return {
                    ...state,
                    modelYears: action.data,
                };
            }

            return {
                ...state,
                modelYears: action.data.results,
            };

        case ActionTypes.SEARCH_RESET:
            if (!action.data) {
                return {
                    ...state,
                    page: 1,
                    deals: [],
                    modelYears: [],
                    showMakeSelectorModal: true,
                    searchQuery: {
                        ...state.searchQuery,
                        entity: 'model',
                        filters: [],
                    },
                };
            } else {
                return {
                    ...state,
                    showMakeSelectorModal: false,
                    page: action.data.page,
                    searchQuery: action.data.searchQuery,
                    deals: [],
                    modelYears: [],
                };
            }

        case ActionTypes.SET_MODEL_YEAR:
            return {
                ...state,
                page: 1,
                selectedMake: action.data.make,
                searchQuery: {
                    ...state.searchQuery,
                    entity: 'deal',
                    filters: uniq([
                        ...state.searchQuery.filters,
                        'model:' + action.data.model,
                    ]),
                },
            };

        case ActionTypes.SET_SELECTED_MAKE:
            return {
                ...state,
                selectedMake: action.data,
            };

        case ActionTypes.SEARCH_CHANGE_SORT:
            return {
                ...state,
                deals: [],
                page: 1,
                searchQuery: {
                    ...state.searchQuery,
                    sort: action.sort,
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
