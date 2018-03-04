import api from 'src/api';
import util from 'src/util';
import R from 'ramda';
import * as ActionTypes from 'actiontypes/index';
import jsonp from 'jsonp';

const withStateDefaults = (state, changed) => {
    console.log(
        Object.assign(
            {},
            {
                makeIds: state.selectedMakes,
                modelIds: R.map(R.prop('id'), state.selectedModels),
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
                zipcode: state.zipcode,
                zipInRange: state.zipInRange,
                vehicleModel: state.vehicleModel,
                vehicleYear: state.vehicleYear,
            },
            changed
        )
    );
    
    return Object.assign(
        {},
        {
            makeIds: state.selectedMakes,
            modelIds: R.map(R.prop('id'), state.selectedModels),
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
            zipcode: state.zipcode,
            zipInRange: state.zipInRange,
            vehicleModel: state.vehicleModel,
            vehicleYear: state.vehicleYear,
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

export function requestModels() {
    return dispatch => {
        dispatch({
            type: ActionTypes.REQUEST_MODELS,
        });

        api.getModels().then(data => {
            dispatch(receiveModels(data));
        });
    };
}

export function receiveMakes(data) {
    return {
        type: ActionTypes.RECEIVE_MAKES,
        data: data,
    };
}

export function receiveModels(data) {
    return {
        type: ActionTypes.RECEIVE_MODELS,
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
        
        requestDealsOrModelYears({
            features: selectedFeatures,
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

        requestDealsOrModelYears({
            makeIds: selectedMakes,
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

        requestDealsOrModelYears({
            modelIds: R.map(R.prop('id'), selectedModels),
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

        dispatch(requestDeals());
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
            type: ActionTypes.CLEAR_MODEL_YEAR
        });

        dispatch(requestModelYears());
    }
}

export function requestDealsOrModelYears(params = {}) {
    return (dispatch, getState) => {
        console.log('Fetching:', getState().filterPage);
        
        dispatch({
            type: getState().filterPage == 'deals' ? ActionTypes.REQUEST_DEALS : ActionTypes.REQUEST_MODEL_YEARS
        });

        api.applySearchFilters(
            getState().filterPage, withStateDefaults(getState(), params)
        ).then(data => {
            if(getState().filterPage == 'deals') {
                dispatch(receiveDeals(data));
            } else {
                dispatch(receiveModelYears(data));
            }
        });
    };
}

export function selectModelYear(vehicleModel) {
    return (dispatch, getState) => {
        dispatch({
            type: ActionTypes.SELECT_MODEL_YEAR,
        });
        console.log('test');
        dispatch(
            requestDealsOrModelYears({
                modelIds: [vehicleModel.id],
                year: vehicleModel.year,
            })
        );
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

        requestDealsOrModelYears({
            bodyStyles: selectedStyles,
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

        requestDealsOrModelYears({
            fuelType: selectedFuelType,
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

        requestDealsOrModelYears({
            transmissionType: selectedTransmissionType,
        });
    };
}

export function chooseSegment(segment) {
    return (dispatch, getState) => {
        const selectedSegment =
            getState().selectedSegment === segment ? null : segment;

        dispatch({
            type: ActionTypes.CHOOSE_SEGMENT,
            selectedSegment,
        });

        requestDealsOrModelYears({
            segment: selectedSegment,
        });
    };
}

export function clearAllFilters() {
    return (dispatch, getState) => {
        dispatch({
            type: ActionTypes.CLEAR_ALL_FILTERS,
        });

        requestDealsOrModelYears({
            makeIds: [],
            bodyStyles: [],
            fuelType: null,
            transmissionType: null,
            features: [],
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

        requestDealsOrModelYears({
            zipcode,
        });

        dispatch(checkZipInRange(zipcode));
    };
}

export function requestLocationInfo() {
    return (dispatch, getState) => {
        /**
         * If we don't already have a loaded zipcode, try to get one from freegeoip.net
         */
        if (!getState().zipcode) {
            jsonp('//freegeoip.net/json/', null, function(err, data) {
                if (err) {
                    dispatch(requestDealsOrModelYears());
                } else {
                    dispatch(receiveLocationInfo(data));
                }
            });
        } else {
            dispatch(requestDealsOrModelYears());
        }

        dispatch({
            type: ActionTypes.REQUEST_LOCATION_INFO,
        });
    };
}

export function receiveLocationInfo(data) {
    return (dispatch, getState) => {
        const zipcode = data.zip_code;
        const city = data.city;

        requestDealsOrModelYears({
            zipcode,
        });

        dispatch({
            type: ActionTypes.RECEIVE_LOCATION_INFO,
            zipcode,
            city,
        });

        dispatch(checkZipInRange(zipcode));
    };
}

export function closeMakeSelectorModal() {
    return {
        type: ActionTypes.CLOSE_MAKE_SELECTOR_MODAL,
    };
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
    return {
        type: ActionTypes.SELECT_TAB,
        data: tab,
    };
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

export function updateDownPayment(downPayment) {
    return {
        type: ActionTypes.UPDATE_DOWN_PAYMENT,
        downPayment,
    };
}

export function updateTermDuration(termDuration) {
    return {
        type: ActionTypes.UPDATE_TERM_DURATION,
        termDuration,
    };
}

export function updateAnnualMileage(annualMileage) {
    return {
        type: ActionTypes.UPDATE_ANNUAL_MILEAGE,
        annualMileage,
    };
}

export function updateResidualPercent(residualPercent) {
    return {
        type: ActionTypes.UPDATE_RESIDUAL_PERCENT,
        residualPercent,
    };
}

export function requestBestOffer(deal) {
    return (dispatch, getState) => {
        const zipcode = getState().zipcode;
        if (!zipcode) return;
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

            dispatch(appendCancelToken(deal, source));
            api
                .getBestOffer(deal.id, paymentType, zipcode, targets, source)
                .then(data => {
                    dispatch(removeCancelToken(deal));
                    dispatch(receiveBestOffer(data, bestOfferKey, paymentType));
                })
                .catch(e => {
                    dispatch(removeCancelToken(deal));
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
                        })
                    );
                });

            dispatch({ type: ActionTypes.REQUEST_BEST_OFFER });
        });

        dispatch(clearCancelTokens());
    };
}

export function receiveBestOffer(data, bestOfferKey, paymentType) {
    // Although lease AND finance have the 'cash' wrapper, we are currently
    // displaying cash best offers in the finance tabs.
    const bestOfferPrograms = paymentType === 'lease' ? data.data.cash : data.data;
    const rates = paymentType === 'lease' ? data.data.rates : [];
    const bestOffer = {
        ...bestOfferPrograms,
        rates: rates
    }
    return dispatch => {
        dispatch({
            type: ActionTypes.RECEIVE_BEST_OFFER,
            data: bestOffer,
            bestOfferKey,
        });
    };
}

export function appendCancelToken(deal, cancelToken) {
    return dispatch => {
        dispatch({
            type: ActionTypes.APPEND_CANCEL_TOKEN,
            deal,
            cancelToken,
        });
    };
}

export function removeCancelToken(deal) {
    return dispatch => {
        dispatch({
            type: ActionTypes.REMOVE_CANCEL_TOKEN,
            deal,
        });
    };
}

export function clearCancelTokens() {
    return dispatch => {
        dispatch({
            type: ActionTypes.CLEAR_CANCEL_TOKENS,
        });
    };
}

export function cancelAllBestOfferPromises() {
    return (dispatch, getState) => {
        getState().cancelTokens.map(cancelToken => {
            try {
                cancelToken.source.cancel();
            } catch (err) {
                console.log('Cancel error: ', err);
            }
        });
        dispatch({ type: ActionTypes.CANCEL_ALL_PROMISES });
        dispatch(clearCancelTokens());
    };
}

export function getBestOffersForLoadedDeals() {
    return (dispatch, getState) => {
        dispatch(cancelAllBestOfferPromises());
        getState().deals.map(deal => {
            dispatch(requestBestOffer(deal));
        });
        dispatch({ type: ActionTypes.REQUEST_ALL_BEST_OFFERS });
    };
}
