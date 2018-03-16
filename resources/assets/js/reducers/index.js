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
            return { ...state, makes: action.data.data.data };
        case ActionTypes.RECEIVE_MODELS:
            return Object.assign({}, state, {
                models: action.data.data.data,
            });
        case ActionTypes.REQUEST_MORE_DEALS:
            return Object.assign({}, state, { requestingMoreDeals: true });
        case ActionTypes.REQUEST_DEALS:
            return {
                ...state,
                deals: null,
                dealPageTotal: null,
                dealPage: null,
                requestingMoreDeals: true,
            };
        case ActionTypes.RECEIVE_DEALS:
            return Object.assign({}, state, {
                deals: action.data.data.data,
                dealPageTotal: action.data.data.meta.pagination.total_pages,
                dealPage: action.data.data.meta.pagination.current_page,
                requestingMoreDeals: false,
                requestingMoreModelYears: false,
                filterPage: 'deals',
            });
        case ActionTypes.REQUEST_MODEL_YEARS:
            return {
                ...state,
                requestingMoreModelYears: true,
                modelYears: null,
                deals: null,
            };
        case ActionTypes.RECEIVE_MODEL_YEARS:
            return Object.assign({}, state, {
                requestingMoreModelYears: false,
                requestingMoreDeals: false,
                modelYears: action.data.data,
            });
        case ActionTypes.CLEAR_MODEL_YEAR:
            return Object.assign({}, state, {
                selectedModels: null,
                filterPage: 'models',
            });
        case ActionTypes.SELECT_MODEL_YEAR:
            return Object.assign({}, state, {
                filterPage: 'deals',
                selectedModels: [action.data.id],
                selectedYear: action.data.id,
            });
        case ActionTypes.RECEIVE_TARGETS:
            const targetKey = util.getTargetKeyForDealAndZip(
                action.data.deal,
                action.data.zipcode
            );

            return {
                ...state,
                targetsAvailable: {
                    ...state.targetsAvailable,
                    [targetKey]: action.data.data.data.targets,
                },
            };
        case ActionTypes.RECEIVE_DEAL_TARGETS:
            let nextDealTargets = Object.assign({}, state.dealTargets);

            nextDealTargets[action.data.dealId] = action.data.data.data.targets;

            return Object.assign({}, state, {
                dealTargets: nextDealTargets,
            });
        case ActionTypes.TOGGLE_TARGET:
            return {
                ...state,
                targetsSelected: {
                    ...state.targetsSelected,
                    [action.targetKey]: util.toggleItem(
                        state.targetsSelected[action.targetKey] || [],
                        action.target
                    ),
                },
            };
        case ActionTypes.SORT_DEALS:
            return Object.assign({}, state, {
                sortColumn: action.sort,
                sortAscending: !state.sortAscending,
            });
        case ActionTypes.SELECT_TAB:
            return Object.assign({}, state, { selectedTab: action.data });
        case ActionTypes.RECEIVE_MORE_DEALS:
            return Object.assign({}, state, {
                deals: R.concat(state.deals || [], action.data.data.data),
                dealPage: R.min(
                    action.data.data.meta.pagination.current_page,
                    action.data.data.meta.pagination.total_pages
                ),
                requestingMoreDeals: false,
                requestingMoreModelYears: false,
            });
        case ActionTypes.TOGGLE_MAKE:
            return Object.assign({}, state, {
                selectedMakes: action.selectedMakes,
            });
        case ActionTypes.TOGGLE_MODEL:
            return Object.assign({}, state, {
                selectedModels: action.selectedModels,
            });
        case ActionTypes.SET_IS_EMPLOYEE:
            return Object.assign({}, state, {
                employeeBrand: action.employeeBrand,
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
        case ActionTypes.RECEIVE_FEATURE_CATEGORIES:
            return Object.assign({}, state, {
                featureCategories: action.data.data.data,
                searchFeatures: action.data.data.included
            });
        case ActionTypes.TOGGLE_STYLE:
            return Object.assign({}, state, {
                selectedStyles: action.selectedStyles,
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
        case ActionTypes.CHOOSE_FUEL_TYPE:
            return Object.assign({}, state, {
                selectedFuelType: action.selectedFuelType,
            });
        case ActionTypes.CHOOSE_SEGMENT:
            return Object.assign({}, state, {
                selectedSegment: action.selectedSegment,
            });
        case ActionTypes.UPDATE_DOWN_PAYMENT:
            return Object.assign({}, state, {
                downPayment: action.downPayment,
            });
        case ActionTypes.UPDATE_ANNUAL_MILEAGE:
            return Object.assign({}, state, {
                annualMileage: action.annualMileage,
            });
        case ActionTypes.UPDATE_RESIDUAL_PERCENT:
            return Object.assign({}, state, {
                residualPercent: action.residualPercent,
            });
        case ActionTypes.UPDATE_TERM_DURATION:
            return {...state, termDuration: action.termDuration}
        case ActionTypes.CHOOSE_TRANSMISSION_TYPE:
            return Object.assign({}, state, {
                selectedTransmissionType: action.selectedTransmissionType,
            });
        case ActionTypes.SELECT_DEAL:
            return Object.assign({}, state, {
                selectedDeal: action.selectedDeal,
            });
        case ActionTypes.CLEAR_SELECTED_DEAL:
            return Object.assign({}, state, { selectedDeal: null });
        case ActionTypes.CLEAR_ALL_FILTERS:
            return Object.assign({}, state, {
                selectedStyles: [],
                selectedTransmissionType: null,
                selectedFuelType: null,
                selectedMakes: [],
                selectedFeatures: [],
            });
        case ActionTypes.TOGGLE_COMPARE:
            return { ...state, compareList: action.compareList };
        case ActionTypes.SET_ZIP_CODE:
            return { ...state, zipcode: action.zipcode, city: null };
        case ActionTypes.RECEIVE_LOCATION_INFO:
            return Object.assign({}, state, {
                zipcode: action.zipcode,
                city: action.city,
            });

        case ActionTypes.SET_ZIP_IN_RANGE:
            return Object.assign({}, state, {
                zipInRange: action.supported,
            });
        case ActionTypes.RECEIVE_BEST_OFFER:
            return {
                ...state,
                bestOffers: {
                    ...state.bestOffers,
                    [action.bestOfferKey]: action.data} }
        case ActionTypes.APPEND_CANCEL_TOKEN:
            return {
                ...state,
                cancelTokens: [
                    ...state.cancelTokens,
                    {
                        dealId: action.deal.id,
                        source: action.cancelToken,
                        context: action.context,
                    },
                ],
            };

        case ActionTypes.REMOVE_CANCEL_TOKEN:
            return {
                ...state,
                cancelTokens: R.reject(
                    R.propEq('dealId', action.deal.id),
                    state.cancelTokens
                ),
            };

        case ActionTypes.CLEAR_CANCEL_TOKENS:
            return {
                ...state,
                cancelTokens: R.reject(
                    R.propEq('context', action.context),
                    state.cancelTokens
                ),
            };
    }

    return state;
};

export default reducer;
