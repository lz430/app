import * as ActionTypes from 'apps/common/consts';
import R from 'ramda';
import { REHYDRATE } from 'redux-persist';
import util from 'src/util';
const urlStyle = util.getInitialBodyStyleFromUrl();
const urlSize = util.getInitialSizeFromUrl();

const initialState = {
    accuPricingModalIsShowing: false,
    bestOffers: [],
    compareList: [],
    dealBestOffer: null,
    employeeBrand: false,
    fallbackLogoImage: '/images/dmr-logo-small.svg',

    infoModalIsShowingFor: null,
    residualPercent: null,
    selectedDeal: null,
    selectedTab: 'cash',
    selectedTargets: [],
    showMakeSelectorModal: true,
    smallFiltersShown: false,
    targets: [],
    targetsAvailable: {},
    targetsSelected: {},
    /** Need to duplicate these in App\Http\Controllers\API\TargetsController::TARGET_OPEN_OFFERS **/
    targetDefaults: [
        25, // Open Offer
        36, // Finance & Lease Customer
        39, // Finance Customer
        26, // Lease Customer
        45, // Captive Finance Customer
        52, // Auto Show Cash Recipient
    ],
    vehicleModel: null,
    vehicleYear: null,
    window: { width: window.innerWidth },
    dealsIdsWithCustomizedQuotes: [],
    leaseRatesLoaded: {},
    leaseRates: null,
    leasePaymentsLoaded: {},
    leasePayments: null,
};

const reducer = (state = initialState, action) => {
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
                    state.common.selectedStyles = [urlStyle];
                }

                state.common.searchQuery.features = [];
                state.common.searchQuery.makes = [];

                window.history.replaceState({}, document.title, '/filter');
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
        case ActionTypes.SELECT_TAB:
            return {
                ...state,
                selectedTab: action.data,
            };

        case ActionTypes.UPDATE_RESIDUAL_PERCENT:
            return Object.assign({}, state, {
                residualPercent: action.residualPercent,
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

        case ActionTypes.SHOW_ACCUPRICING_MODAL:
            return {
                ...state,
                accuPricingModalIsShowing: true,
            };
        case ActionTypes.HIDE_ACCUPRICING_MODAL:
            return {
                ...state,
                accuPricingModalIsShowing: false,
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
