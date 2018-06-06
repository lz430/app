import api from 'src/api';
import util from 'src/util';
import R from 'ramda';
import * as ActionTypes from 'actiontypes/index';
import jsonp from 'jsonp';
import DealPricing from 'src/DealPricing';
import {makeDealPricing} from "selectors/index";

const withStateDefaults = (state, changed) => {
    return Object.assign(
        {},
        {
            makeIds: state.selectedMakes,
            modelIds: state.selectedModels,
            bodyStyles: state.selectedStyles,
            fuelType: state.selectedFuelType,
            transmissionType: state.selectedTransmissionType,
            segment: state.selectedSegment,
            features: state.selectedFeatures,
            featureCategories: state.featureCategories,
            includes: ['photos'],
            sortColumn: state.sortColumn,
            sortAscending: state.sortAscending,
            page: 1,
            year: state.selectedYear,
            zipcode: state.zipcode,
            zipInRange: state.zipInRange,
        },
        changed
    );
};

export function requestMakes() {
    return dispatch => {
        dispatch({
            type: ActionTypes.REQUEST_MAKES,
        });

        api.getMakes().then(data => {
            dispatch(receiveMakes(data));
        });
    };
}

export function receiveMakes(data) {
    return {
        type: ActionTypes.RECEIVE_MAKES,
        data: data,
    };
}

export function requestFeatures() {
    return dispatch => {
        dispatch({
            type: ActionTypes.REQUEST_FEATURES,
        });

        api.getFeatures().then(data => {
            dispatch(receiveFeatures(data));
        });
    };
}

export function requestFeatureCategories() {
    return dispatch => {
        dispatch({
            type: ActionTypes.REQUEST_FEATURE_CATEGORIES,
        });

        api.getFeatureCategories().then(data => {
            dispatch(receiveFeatureCategories(data));
        });
    };
}

export function receiveFeatures(data) {
    return {
        type: ActionTypes.RECEIVE_FEATURES,
        data: data,
    };
}

export function receiveFeatureCategories(data) {
    return {
        type: ActionTypes.RECEIVE_FEATURE_CATEGORIES,
        data: data,
    };
}

export function toggleFeature(feature) {
    return (dispatch, getState) => {
        const selectedFeatures = util.toggleItem(
            getState().selectedFeatures,
            feature
        );

        dispatch({
            type: ActionTypes.TOGGLE_FEATURE,
            selectedFeatures,
        });

        dispatch({
            type: ActionTypes.REQUEST_SEARCH,
        });
    };
}

export function toggleMake(make_id) {
    return (dispatch, getState) => {
        const selectedMakes = util.toggleItem(
            getState().selectedMakes,
            make_id
        );

        dispatch({
            type: ActionTypes.TOGGLE_MAKE,
            selectedMakes,
        });

        dispatch({
            type: ActionTypes.REQUEST_SEARCH,
        });
    };
}

export function toggleModel(model) {
    return (dispatch, getState) => {
        const selectedModels = util.toggleItem(
            getState().selectedModels,
            model
        );

        dispatch({
            type: ActionTypes.TOGGLE_MODEL,
            selectedModels,
        });

        dispatch({
            type: ActionTypes.REQUEST_SEARCH,
        });
    };
}

export function requestTargets(deal) {
    return (dispatch, getState) => {
        // If no zipcode has been set, do not request targets
        const zipcode = getState().zipcode;
        if (!zipcode) return;

        // If we already have the target data, do not re-request it
        const targetKey = util.getTargetKeyForDealAndZip(deal, zipcode);
        if (!R.isNil(getState().targetsAvailable[targetKey])) return;

        dispatch({
            type: ActionTypes.REQUEST_TARGETS,
        });

        api.getTargets(zipcode, deal.vin).then(data => {
            dispatch(
                receiveTargets({
                    data,
                    deal,
                    zipcode,
                })
            );
        });
    };
}

export function receiveTargets(data) {
    return dispatch => {
        dispatch({
            type: ActionTypes.RECEIVE_TARGETS,
            data: data,
        });
    };
}

export function receiveDeals(data) {
    return dispatch => {
        dispatch({
            type: ActionTypes.RECEIVE_DEALS,
            data: data,
        });
    };
}


export function requestDeals() {
    return (dispatch, getState) => {
        dispatch({
            type: ActionTypes.REQUEST_DEALS,
        });

        api.getDeals(withStateDefaults(getState())).then(data => {
            dispatch(receiveDeals(data));
        });
    };
}

export function requestMoreDeals() {
    return (dispatch, getState) => {
        dispatch({
            type: ActionTypes.REQUEST_MORE_DEALS,
        });

        api
            .applySearchFilters(
                getState().filterPage,
                withStateDefaults(getState(), {
                    page: getState().dealPage + 1,
                })
            )
            .then(data => {
                dispatch(receiveMoreDeals(data));
            });
    };
}

export function sortDeals(sort) {
    return dispatch => {
        dispatch({
            type: ActionTypes.SORT_DEALS,
            sort,
        });

        dispatch({
            type: ActionTypes.REQUEST_SEARCH,
        });
    };
}

export function receiveModelYears(data) {
    return dispatch => {
        dispatch({
            type: ActionTypes.RECEIVE_MODEL_YEARS,
            data: data,
        });
    };
}

export function requestModelYears() {
    return (dispatch, getState) => {
        dispatch({
            type: ActionTypes.REQUEST_MODEL_YEARS,
        });

        api.getModelYears(withStateDefaults(getState())).then(data => {
            dispatch(receiveModelYears(data));
        });
    };
}

export function clearModelYear() {
    return dispatch => {
        dispatch({
            type: ActionTypes.CLEAR_MODEL_YEAR,
        });

        dispatch(requestModelYears());
    };
}

export function selectModelYear(vehicleModel) {
    return (dispatch, getState) => {
        dispatch({
            type: ActionTypes.SELECT_MODEL_YEAR,
            data: vehicleModel,
        });

        dispatch({
            type: ActionTypes.REQUEST_SEARCH,
        });
    };
}

export function receiveBodyStyles(deals) {
    return {
        type: ActionTypes.RECEIVE_BODY_STYLES,
        data: deals,
    };
}

export function setEmployeeBrand(employeeBrand) {
    return {
        type: ActionTypes.SET_IS_EMPLOYEE,
        employeeBrand,
    };
}

export function checkZipInRange(code) {
    return dispatch => {
        api.checkZipInRange(code).then(data => {
            return dispatch(setZipInRange(data.data));
        });
    };
}

export function setZipInRange(data) {
    return dispatch => {
        api.setZip(data.code).then(() => {
            return dispatch({
                type: ActionTypes.SET_ZIP_IN_RANGE,
                supported: data.supported,
            });
        });

        dispatch({
            type: ActionTypes.REQUEST_SEARCH,
        });
    };
}

export function receiveMoreDeals(data) {
    return dispatch => {
        dispatch({
            type: ActionTypes.RECEIVE_MORE_DEALS,
            data: data,
        });
    };
}

export function requestBodyStyles() {
    return dispatch => {
        dispatch({
            type: ActionTypes.REQUEST_BODY_STYLES,
        });

        api.getBodyStyles().then(data => {
            dispatch(receiveBodyStyles(data));
        });
    };
}

export function toggleStyle(style) {
    return (dispatch, getState) => {
        const selectedStyles = util.toggleItem(
            getState().selectedStyles,
            style
        );

        dispatch({
            type: ActionTypes.TOGGLE_STYLE,
            selectedStyles: selectedStyles,
        });

        dispatch({
            type: ActionTypes.REQUEST_SEARCH,
        });
    };
}

export function chooseFuelType(fuelType) {
    return (dispatch, getState) => {
        const selectedFuelType =
            getState().selectedFuelType === fuelType ? null : fuelType;

        dispatch({
            type: ActionTypes.CHOOSE_FUEL_TYPE,
            selectedFuelType: selectedFuelType,
        });

        dispatch({
            type: ActionTypes.REQUEST_SEARCH,
        });
    };
}

export function chooseTransmissionType(transmissionType) {
    return (dispatch, getState) => {
        const selectedTransmissionType =
            getState().selectedTransmissionType === transmissionType
                ? null
                : transmissionType;

        dispatch({
            type: ActionTypes.CHOOSE_TRANSMISSION_TYPE,
            selectedTransmissionType,
        });

        dispatch({
            type: ActionTypes.REQUEST_SEARCH,
        });
    };
}

export function chooseYear(year) {
    return (dispatch, getState) => {
        const selectedYear =
            getState().selectedYear === year ? null : year;

        dispatch({
            type: ActionTypes.CHOOSE_YEAR,
            selectedYear,
        });

        dispatch({
            type: ActionTypes.REQUEST_SEARCH,
        });
    };
}

export function clearAllFilters() {
    return (dispatch, getState) => {
        dispatch({
            type: ActionTypes.CLEAR_ALL_FILTERS,
        });

        dispatch({
            type: ActionTypes.REQUEST_SEARCH,
        });
    };
}

export function toggleCompare(deal) {
    return (dispatch, getState) => {
        const deals = getState().compareList.map(R.prop('deal'));

        const nextCompareList = util.toggleItem(deals, deal).map(d => {
            return {
                deal: d,
                selectedFilters: R.propOr(
                    {
                        selectedStyles: getState().selectedStyles,
                        selectedMakes: getState().selectedMakes,
                        selectedFuelType: getState().selectedFuelType,
                        selectedTransmissionType: getState()
                            .selectedTransmissionType,
                        selectedFeatures: getState().selectedFeatures,
                    },
                    'selectedFilters',
                    R.find(dealAndSelectedFilters => {
                        return dealAndSelectedFilters.deal.id === d.id;
                    }, getState().compareList)
                ),
            };
        });

        dispatch({
            type: ActionTypes.TOGGLE_COMPARE,
            compareList: nextCompareList,
        });
    };
}

export function setZipCode(zipcode) {
    return (dispatch, getState) => {
        dispatch({
            type: ActionTypes.SET_ZIP_CODE,
            zipcode,
        });

        dispatch(checkZipInRange(zipcode));
    };
}

export function requestLocationInfo() {
    return (dispatch, getState) => {
        return new Promise((resolve) => {
            /**
             * If we don't already have a loaded zipcode, try to get one from freegeoip.net
             */
            if (!getState().zipcode) {
                jsonp('//freegeoip.net/json/', null, function(err, data) {
                    if (err) {
                        dispatch({
                            type: ActionTypes.REQUEST_SEARCH,
                        });
                    } else {
                        dispatch(receiveLocationInfo(data));
                        resolve(data.zip_code)
                    }
                });
            } else {
                dispatch({
                    type: ActionTypes.REQUEST_SEARCH,
                });
            }

            dispatch({
                type: ActionTypes.REQUEST_LOCATION_INFO,
            });
        });
    };
}

export function receiveLocationInfo(data) {
    return (dispatch, getState) => {
        const zipcode = data.zip_code;
        const city = data.city;

        dispatch({
            type: ActionTypes.RECEIVE_LOCATION_INFO,
            zipcode,
            city,
        });

        dispatch(checkZipInRange(zipcode));

        dispatch({
            type: ActionTypes.REQUEST_SEARCH,
        });
    };
}

export function closeMakeSelectorModal() {
    return (dispatch, getState) => {
        dispatch({
            type: ActionTypes.CLOSE_MAKE_SELECTOR_MODAL,
        });

        dispatch({
            type: ActionTypes.REQUEST_SEARCH,
        });
    }
}

export function windowResize(width) {
    return {
        type: ActionTypes.WINDOW_RESIZE,
        window: {
            width,
        },
    };
}

export function toggleSmallFiltersShown() {
    return {
        type: ActionTypes.TOGGLE_SMALL_FILTERS_SHOWN,
    };
}

export function selectTab(tab) {
    return (dispatch, getState) => {
        dispatch({
            type: ActionTypes.SELECT_TAB,
            data: tab,
        });
    }
}

export function selectDeal(deal) {
    return {
        type: ActionTypes.SELECT_DEAL,
        selectedDeal: deal,
    };
}

export function clearSelectedDeal() {
    return {
        type: ActionTypes.CLEAR_SELECTED_DEAL,
    };
}

export function selectRebate(rebate) {
    return {
        type: ActionTypes.SELECT_REBATE,
        rebate,
    };
}

export function toggleTarget(target, targetKey) {
    return {
        type: ActionTypes.TOGGLE_TARGET,
        target,
        targetKey,
    };
}

export function updateFinanceTerm(term) {
    return {
        type: ActionTypes.UPDATE_FINANCE_TERM,
        term,
    };
}

export function updateFinanceDownPayment(downPayment) {
    return {
        type: ActionTypes.UPDATE_FINANCE_DOWN_PAYMENT,
        downPayment,
    };
}

export function updateLeaseAnnualMileage(deal, annualMileage) {
    return (dispatch, getState) => {
        const zipcode = getState().zipcode;

        if (!zipcode) return;

        dispatch({
            type: ActionTypes.UPDATE_LEASE_ANNUAL_MILEAGE,
            deal,
            annualMileage,
            zipcode,
        });
    };
}

export function updateLeaseTerm(deal, term) {
    return (dispatch, getState) => {
        const zipcode = getState().zipcode;

        if (!zipcode) return;

        dispatch({
            type: ActionTypes.UPDATE_LEASE_TERM,
            deal,
            term,
            zipcode,
        });
    };
}

export function updateLeaseCashDue(deal, cashDue) {
    return (dispatch, getState) => {
        const zipcode = getState().zipcode;

        if (!zipcode) return;

        dispatch({
            type: ActionTypes.UPDATE_LEASE_CASH_DUE,
            deal,
            cashDue,
            zipcode,
        });
    };
}

const getDealPricing = makeDealPricing();

export function requestLeasePayments(deal) {
    return (dispatch, getState) => {
        const zipcode = getState().zipcode;

        if (!zipcode) return;

        const dealPricing = new DealPricing(getDealPricing(getState(), {deal, zipcode}));

        if (dealPricing.isNotLease()) {
            return;
        }

        if (dealPricing.hasNoLeaseTerms()) {
            return;
        }

        dispatch({
            type: ActionTypes.REQUEST_LEASE_PAYMENTS,
            dealPricing,
            zipcode
        });

        api
            .getLeasePayments(dealPricing)
            .then(data => {
                dispatch(receiveLeasePayments(dealPricing, zipcode, data.data));
            })
            .catch(e => {
                dispatch(receiveLeasePayments(dealPricing, zipcode));
            });
    }
}

function receiveLeasePayments(dealPricing, zipcode, data) {
    return dispatch => dispatch({
        type: ActionTypes.RECEIVE_LEASE_PAYMENTS,
        dealPricing,
        zipcode,
        data
    })
}

export function requestLeaseRates(deal) {
    return (dispatch, getState) => {
        const zipcode = getState().zipcode;

        if (!zipcode) return;

        dispatch({
            type: ActionTypes.REQUEST_LEASE_RATES,
            deal,
            zipcode
        });

        api
            .getLeaseRates(deal, zipcode)
            .then(data => {
                dispatch(receiveLeaseRates(deal, zipcode, data.data));
                if (data.data.length > 0) {
                    dispatch(requestLeasePayments(deal));
                }
            })
            .catch(e => {
                dispatch(receiveLeaseRates(deal, zipcode, null))
            });
    }
}

function receiveLeaseRates(deal, zipcode, data) {
    return dispatch => dispatch({
        type: ActionTypes.RECEIVE_LEASE_RATES,
        deal,
        zipcode,
        data
    })
}

export function requestBestOffer(deal) {
    return (dispatch, getState) => {
        const zipcode = getState().zipcode;

        if (!zipcode) {
            dispatch(requestLocationInfo()).then((new_zipcode) => {
                dispatch(requestBestOffer(deal));
            });

            return;
        }

        const targetKey = util.getTargetKeyForDealAndZip(deal, zipcode);
        const selectedTargetIds = getState().targetsSelected[targetKey]
            ? R.map(R.prop('targetId'), getState().targetsSelected[targetKey])
            : [];
        const targets = R.uniq(
            getState().targetDefaults.concat(selectedTargetIds)
        );

        // Temporarily limit to only selected payment type until we can address performance issues
        let paymentTypes = [getState().selectedTab];
        // We can ask for all payment types by uncommenting this:
        // const paymentTypes = ['cash', 'finance', 'lease'];

        paymentTypes.map(paymentType => {
            const bestOfferKey = util.getBestOfferKeyForDeal(
                deal,
                zipcode,
                getState().selectedTab,
                targets
            );

            // if the best offer is already in store, do not call for it again
            if (R.props(bestOfferKey, getState().bestOffers)) {
                dispatch({ type: ActionTypes.SAME_BEST_OFFERS });
            }

            const CancelToken = window.axios.CancelToken;
            const source = CancelToken.source();

            dispatch(appendCancelToken(source, 'bestOffer', deal.id));
            api
                .getBestOffer(deal.id, paymentType, zipcode, targets, source)
                .then(data => {
                    dispatch(removeCancelToken(deal.id));
                    dispatch(receiveBestOffer(data, bestOfferKey, paymentType));
                    dispatch(requestLeaseRates(deal));
                })
                .catch(e => {
                    dispatch(removeCancelToken(deal.id));
                    dispatch(
                        receiveBestOffer({
                            data: {
                                data: {
                                    cash: {
                                        totalValue: 0,
                                        programs: [],
                                    },
                                },
                            },
                        }, bestOfferKey, paymentType)
                    );
                });

            dispatch({ type: ActionTypes.REQUEST_BEST_OFFER });
        });
    };
}

export function receiveBestOffer(data, bestOfferKey, paymentType) {
    // Although lease AND finance have the 'cash' wrapper, we are currently
    // displaying cash best offers in the finance tabs.
    const bestOfferPrograms =
        paymentType === 'lease' ? data.data.cash : data.data;
    const rates = paymentType === 'lease' ? data.data.rates : [];
    const bestOffer = {
        ...bestOfferPrograms,
        rates: rates,
    };
    return dispatch => {
        dispatch({
            type: ActionTypes.RECEIVE_BEST_OFFER,
            data: bestOffer,
            bestOfferKey,
        });
    };
}

export function appendCancelToken(cancelToken, context = 'default', identifier = null) {
    return dispatch => {
        dispatch({
            type: ActionTypes.APPEND_CANCEL_TOKEN,
            identifier,
            cancelToken,
            context,
        });
    };
}

export function removeCancelToken(identifier) {
    return dispatch => {
        dispatch({
            type: ActionTypes.REMOVE_CANCEL_TOKEN,
            identifier,
        });
    };
}

export function clearCancelTokens(context = 'default') {
    return dispatch => {
        dispatch({
            type: ActionTypes.CLEAR_CANCEL_TOKENS,
            context,
        });
    };
}

export function cancelPromises(context) {
    return (dispatch, getState) => {
        getState()
            .cancelTokens.filter(cancelToken => {
                return cancelToken.context == context;
            })
            .map(cancelToken => {
                try {
                    cancelToken.source.cancel();
                } catch (err) {
                    console.log('Cancel error: ', err);
                }
            });

        dispatch(clearCancelTokens(context));
    };
}

export function getBestOffersForLoadedDeals() {
    return (dispatch, getState) => {
        dispatch(cancelPromises('bestOffer'));
        const deals = getState().deals;

        if (deals) {
            getState().deals.map(deal => {
                dispatch(requestBestOffer(deal));
            });
            dispatch({type: ActionTypes.REQUEST_ALL_BEST_OFFERS});
        }
    };
}

export function showAccuPricingModal() {
    return {
        type: ActionTypes.SHOW_ACCUPRICING_MODAL
    }
}

export function hideAccuPricingModal() {
    return {
        type: ActionTypes.HIDE_ACCUPRICING_MODAL
    }
}

export function showInfoModal(dealId) {
    return {
        type: ActionTypes.SHOW_INFO_MODAL,
        dealId,
    }
}

export function hideInfoModal() {
    return {
        type: ActionTypes.HIDE_INFO_MODAL
    }
}
