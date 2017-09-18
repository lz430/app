import api from 'src/api';
import util from 'src/util';
import R from 'ramda';
import * as ActionTypes from 'actiontypes/index';
import jsonp from 'jsonp';

const withStateDefaults = (state, changed) => {
    return Object.assign(
        {},
        {
            makeIds: state.selectedMakes,
            bodyStyles: state.selectedStyles,
            fuelType: state.selectedFuelType,
            transmissionType: state.selectedTransmissionType,
            features: state.selectedFeatures,
            includes: ['photos'],
            sortColumn: state.sortColumn,
            sortAscending: state.sortAscending,
            page: 1,
            zipcode: state.zipcode,
        },
        changed
    );
};

export function requestMakes() {
    return dispatch => {
        api.getMakes().then(data => {
            dispatch(receiveMakes(data));
        });

        dispatch({
            type: ActionTypes.REQUEST_MAKES,
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
        api.getFeatures().then(data => {
            dispatch(receiveFeatures(data));
        });

        dispatch({
            type: ActionTypes.REQUEST_FEATURES,
        });
    };
}

export function receiveFeatures(data) {
    return {
        type: ActionTypes.RECEIVE_FEATURES,
        data: data,
    };
}

export function toggleFeature(feature) {
    return (dispatch, getState) => {
        dispatch({
            type: ActionTypes.REQUEST_DEALS,
        });

        const selectedFeatures = util.toggleItem(
            getState().selectedFeatures,
            feature
        );

        api
            .getDeals(
                withStateDefaults(getState(), {
                    features: selectedFeatures,
                })
            )
            .then(data => {
                dispatch(receiveDeals(data));
            });

        dispatch({
            type: ActionTypes.TOGGLE_FEATURE,
            selectedFeatures,
        });
    };
}

export function toggleMake(make_id) {
    return (dispatch, getState) => {
        dispatch({
            type: ActionTypes.REQUEST_DEALS,
        });

        const selectedMakes = util.toggleItem(
            getState().selectedMakes,
            make_id
        );

        api
            .getDeals(
                withStateDefaults(getState(), {
                    makeIds: selectedMakes,
                })
            )
            .then(data => {
                dispatch(receiveDeals(data));
            });

        dispatch({
            type: ActionTypes.TOGGLE_MAKE,
            selectedMakes,
        });
    };
}

export function requestRebates(deal) {
    return (dispatch, getState) => {
        // If we have already received the rebates for the deal, don't request them again.
        if (getState().dealRebates.hasOwnProperty(deal.id)) return;

        api.getRebates(getState().zipcode, deal.vin).then(data => {
            dispatch(
                receiveDealRebates({
                    data: data,
                    dealId: deal.id,
                })
            );
        });

        dispatch({
            type: ActionTypes.REQUEST_REBATES,
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

export function receiveDealRebates(data) {
    return dispatch => {
        data.data.data.rebates.map(rebate => {
            if (rebate.openOffer) {
                dispatch(selectRebate(rebate));
            }
        });

        dispatch({
            type: ActionTypes.RECEIVE_DEAL_REBATES,
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
            .getDeals(
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
    return {
        type: ActionTypes.SORT_DEALS,
        sort,
    };
}

export function receiveBodyStyles(deals) {
    return {
        type: ActionTypes.RECEIVE_BODY_STYLES,
        data: deals,
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
        api.getBodyStyles().then(data => {
            dispatch(receiveBodyStyles(data));
        });

        dispatch({
            type: ActionTypes.REQUEST_BODY_STYLES,
        });
    };
}

export function toggleStyle(style) {
    return (dispatch, getState) => {
        dispatch({
            type: ActionTypes.REQUEST_DEALS,
        });

        const selectedStyles = util.toggleItem(
            getState().selectedStyles,
            style
        );

        api
            .getDeals(
                withStateDefaults(getState(), {
                    bodyStyles: selectedStyles,
                })
            )
            .then(data => {
                dispatch(receiveDeals(data));
            });

        window.axios.post('/hubspot', { bodystyle1: selectedStyles.join() });

        dispatch({
            type: ActionTypes.TOGGLE_STYLE,
            selectedStyles: selectedStyles,
        });
    };
}

export function chooseFuelType(fuelType) {
    return (dispatch, getState) => {
        dispatch({
            type: ActionTypes.REQUEST_DEALS,
        });

        const selectedFuelType =
            getState().selectedFuelType === fuelType ? null : fuelType;

        api
            .getDeals(
                withStateDefaults(getState(), {
                    fuelType: selectedFuelType,
                })
            )
            .then(data => {
                dispatch(receiveDeals(data));
            });

        dispatch({
            type: ActionTypes.CHOOSE_FUEL_TYPE,
            selectedFuelType: selectedFuelType,
        });
    };
}

export function chooseTransmissionType(transmissionType) {
    return (dispatch, getState) => {
        dispatch({
            type: ActionTypes.REQUEST_DEALS,
        });

        const selectedTransmissionType =
            getState().selectedTransmissionType === transmissionType
                ? null
                : transmissionType;

        api
            .getDeals(
                withStateDefaults(getState(), {
                    transmissionType: selectedTransmissionType,
                })
            )
            .then(data => {
                dispatch(receiveDeals(data));
            });

        dispatch({
            type: ActionTypes.CHOOSE_TRANSMISSION_TYPE,
            selectedTransmissionType: selectedTransmissionType,
        });
    };
}

export function clearAllFilters() {
    return (dispatch, getState) => {
        dispatch({
            type: ActionTypes.REQUEST_DEALS,
        });

        api
            .getDeals(
                withStateDefaults(getState(), {
                    makeIds: [],
                    bodyStyles: [],
                    fuelType: null,
                    transmissionType: null,
                    features: [],
                })
            )
            .then(data => {
                dispatch(receiveDeals(data));
            });

        dispatch({
            type: ActionTypes.CLEAR_ALL_FILTERS,
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
            type: ActionTypes.REQUEST_DEALS,
        });

        api
            .getDeals(
                withStateDefaults(getState(), {
                    zipcode,
                })
            )
            .then(data => {
                dispatch(receiveDeals(data));
            });

        window.axios.post('/hubspot', { zip: zipcode });

        dispatch({
            type: ActionTypes.SET_ZIP_CODE,
            zipcode,
        });
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
                    dispatch(requestDeals());
                } else {
                    window.axios.post('/hubspot', { zip: data.zip_code });
                    dispatch(receiveLocationInfo(data));
                }
            });
        } else {
            dispatch(requestDeals());
        }

        dispatch({
            type: ActionTypes.REQUEST_LOCATION_INFO,
        });
    };
}

export function receiveLocationInfo(data) {
    return (dispatch, getState) => {
        dispatch({
            type: ActionTypes.REQUEST_DEALS,
        });

        const zipcode = data.zip_code;
        const city = data.city;

        api
            .getDeals(
                withStateDefaults(getState(), {
                    zipcode,
                })
            )
            .then(data => {
                dispatch(receiveDeals(data));
            });

        dispatch({
            type: ActionTypes.RECEIVE_LOCATION_INFO,
            zipcode,
            city,
        });
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

export function toggleRebate(rebate) {
    return {
        type: ActionTypes.TOGGLE_REBATE,
        rebate,
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
