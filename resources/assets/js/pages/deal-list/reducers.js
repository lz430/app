import { persistReducer } from 'redux-persist';
import { basePersistConfig } from 'persist';

import * as ActionTypes from './consts';

import util from 'src/util';
import { REHYDRATE } from 'redux-persist';

const urlStyle = util.getInitialBodyStyleFromUrl();
const urlSize = util.getInitialSizeFromUrl();

const initialState = {
    page: 1,
    searchQuery: {
        entity: 'model', // deal or model depending on the page we're on.
        sort: {
            attribute: 'price',
            direction: 'asc',
        },
        years: [],
        makes: [],
        models: [],
        styles: urlStyle ? [urlStyle] : [],
        features: urlSize ? [urlSize] : [],
    },
    modelYears: [],
    deals: [],
    loadingSearchResults: true,
    meta: {},
    filters: {},
};

const persistConfig = {
    ...basePersistConfig,
    key: 'dealList',
    blacklist: [
        'deals',
        'dealPage',
        'dealPageTotal',
        'modelYears',
        'loadingSearchResults',
        'page',
        'meta',
        'filters',
    ],
};

const reducer = function(state = initialState, action = {}) {
    switch (action.type) {
        case REHYDRATE:
            /**
             * If we have a new url style / url size
             */
            if (urlSize || urlStyle) {
                if (urlStyle) {
                    state.selectedStyles = [urlStyle];
                }

                state.searchQuery.features = [];
                state.searchQuery.makes = [];

                window.history.replaceState({}, document.title, '/filter');
                return state;
            }

            return state;

        case ActionTypes.INIT:
            return state;

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
                    models: [action.data.id],
                    years: [action.data.year],
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

        case ActionTypes.TOGGLE_MAKE:
            return {
                ...state,
                page: 1,
                searchQuery: {
                    ...state.searchQuery,
                    makes: action.selectedMakes,
                },
            };

        case ActionTypes.TOGGLE_MODEL:
            return {
                ...state,
                page: 1,
                searchQuery: {
                    ...state.searchQuery,
                    models: action.selectedModels,
                },
            };

        case ActionTypes.TOGGLE_STYLE:
            return {
                ...state,
                page: 1,
                searchQuery: {
                    ...state.searchQuery,
                    styles: action.selectedStyles,
                },
            };

        case ActionTypes.TOGGLE_FEATURE:
            return {
                ...state,
                page: 1,
                searchQuery: {
                    ...state.searchQuery,
                    features: action.selectedFeatures,
                },
            };

        case ActionTypes.CLEAR_ALL_FILTERS:
            return {
                ...state,
                deals: [],
                page: 1,
                searchQuery: {
                    ...state.searchQuery,
                    features: [],
                },
            };

        case ActionTypes.CHOOSE_YEAR:
            return Object.assign({}, state, {
                selectedYear: action.selectedYear,
            });
        default:
            return state;
    }
};

export default persistReducer(persistConfig, reducer);
