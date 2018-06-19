import { combineReducers } from 'redux';
import reduceReducers from 'reduce-reducers';
import * as ActionTypes from 'actiontypes/index';
import R from 'ramda';
import { REHYDRATE } from 'redux-persist';
import util from 'src/util';
import isEqual from 'lodash.isequal';
const urlStyle = util.getInitialBodyStyleFromUrl();
const urlSize = util.getInitialSizeFromUrl();

import dealDetailsReducer from '../containers/dealDetails/reducer'

const rootReducer = (state, action) => {
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

            /**
             * If we have a new url style / url size
             */
            if (urlSize || urlStyle) {

                if (urlStyle) {
                    state.selectedStyles = [urlStyle];
                }
                /*
                if (urlSize) {
                    state.selectedFeatures = [urlSize];
                }
                */
                state.selectedFeatures = [];
                state.selectedMakes = [];

                window.history.replaceState({}, document.title, "/filter");
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
                selectedYear: null,
                filterPage: 'models',
            });
        case ActionTypes.SELECT_MODEL_YEAR:
            return Object.assign({}, state, {
                filterPage: 'deals',
                selectedModels: [action.data.id],
                selectedYear: action.data.year,
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
        case ActionTypes.CHOOSE_YEAR:
            return Object.assign({}, state, {
                selectedYear: action.selectedYear,
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
                dealsIdsWithCustomizedQuotes: R.union(state.dealsIdsWithCustomizedQuotes, [action.selectedDeal.version.jato_vehicle_id]),
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
            if (isEqual(state.bestOffers[action.bestOfferKey], action.data)) {
                return state;
            }

            return {
                ...state,
                bestOffers: {
                    ...state.bestOffers,
                    [action.bestOfferKey]: action.data
                }

            };
        case ActionTypes.APPEND_CANCEL_TOKEN:
            return {
                ...state,
                cancelTokens: [
                    ...state.cancelTokens,
                    {
                        identifier: action.identifier,
                        source: action.cancelToken,
                        context: action.context,
                    },
                ],
            };

        case ActionTypes.REMOVE_CANCEL_TOKEN:
            return {
                ...state,
                cancelTokens: R.reject(
                    R.propEq('identifier', action.identifier),
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
        case ActionTypes.SHOW_ACCUPRICING_MODAL:
            return {
                ...state,
                accuPricingModalIsShowing: true
            };
        case ActionTypes.HIDE_ACCUPRICING_MODAL:
            return {
                ...state,
                accuPricingModalIsShowing: false
            };
        case ActionTypes.SHOW_INFO_MODAL:
            return {
                ...state,
                infoModalIsShowingFor: action.dealId
            };
        case ActionTypes.HIDE_INFO_MODAL:
            return {
                ...state,
                infoModalIsShowingFor: null
            };
        case ActionTypes.UPDATE_FINANCE_DOWN_PAYMENT:
            if (state.financeDownPayment === action.downPayment) {
                return state;
            }

            return {
                ...state,
                financeDownPayment: action.downPayment
            }
        case ActionTypes.UPDATE_FINANCE_TERM:
            if (state.financeTerm === action.term) {
                return state;
            }

            return {
                ...state,
                financeTerm: action.term
            };

        case ActionTypes.UPDATE_LEASE_TERM:
            return {...state, leaseTerm: {...state.leaseTerm, [`${action.deal.id}.${action.zipcode}`]: action.term}};

        case ActionTypes.UPDATE_LEASE_ANNUAL_MILEAGE:
            return {...state, leaseAnnualMileage: {...state.leaseAnnualMileage, [`${action.deal.id}.${action.zipcode}`]: action.annualMileage}};

        case ActionTypes.UPDATE_LEASE_CASH_DUE:
            return {...state, leaseCashDue: {...state.leaseCashDue, [`${action.deal.id}.${action.zipcode}`]: action.cashDue}};

        case ActionTypes.REQUEST_LEASE_RATES:
            return state;

        case ActionTypes.RECEIVE_LEASE_RATES:
            const leaseRatesKey = `${action.deal.version.jato_vehicle_id}.${action.zipcode}`;

            return {...state, leaseRates: {
                    ...state.leaseRates,
                    [leaseRatesKey]: action.data
                }, leaseRatesLoaded: {
                    ...state.leaseRatesLoaded,
                    [leaseRatesKey]: true,
                }};

        case ActionTypes.REQUEST_LEASE_PAYMENTS:
            return state;

        case ActionTypes.RECEIVE_LEASE_PAYMENTS:
            const leasePaymentsKey = `${action.dealPricing.vin()}.${action.zipcode}`;

            const leasePaymentsMatrix = {};

            for (let leasePayment of action.data) {
                if (! leasePaymentsMatrix[leasePayment.term]) {
                    leasePaymentsMatrix[leasePayment.term] = {};
                }

                if (! leasePaymentsMatrix[leasePayment.term][leasePayment.cash_due]) {
                    leasePaymentsMatrix[leasePayment.term][leasePayment.cash_due] = {};
                }

                leasePaymentsMatrix[leasePayment.term][leasePayment.cash_due][leasePayment.annual_mileage] = {
                    monthlyPayment: leasePayment.monthly_payment,
                    totalAmountAtDriveOff: leasePayment.total_amount_at_drive_off
                };
            }

            return {...state, leasePayments: {
                    ...state.leasePayments,
                    [leasePaymentsKey]: leasePaymentsMatrix
                }, leasePaymentsLoaded: {
                    ...state.leasePaymentsLoaded,
                    [leasePaymentsKey]: true,
                }};
    }

    return state;
};

const containersReducer = combineReducers({
    dealDetails: dealDetailsReducer
});

export default (state, action) => {
    return rootReducer({
        ...state,
        containers: containersReducer(state.containers, action)
    }, action);
}