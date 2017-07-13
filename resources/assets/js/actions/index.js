import api from 'src/api';
import util from 'src/util';
import * as ActionTypes from 'actiontypes/index';

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

export function receiveDeals(data) {
    return {
        type: ActionTypes.RECEIVE_DEALS,
        data: data,
    };
}

export function requestDeals() {
    return (dispatch, getState) => {
        api.getDeals(withStateDefaults(getState())).then(data => {
            dispatch(receiveDeals(data));
        });

        dispatch({
            type: ActionTypes.REQUEST_DEALS,
        });
    };
}

export function requestMoreDeals() {
    return (dispatch, getState) => {
        api
            .getDeals(
                withStateDefaults(getState(), {
                    page: getState().dealPage + 1,
                })
            )
            .then(data => {
                dispatch(receiveMoreDeals(data));
            });

        dispatch({
            type: ActionTypes.REQUEST_MORE_DEALS,
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

export function receiveMoreDeals(deals) {
    return {
        type: ActionTypes.RECEIVE_MORE_DEALS,
        data: deals,
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

        dispatch({
            type: ActionTypes.TOGGLE_STYLE,
            selectedStyles: selectedStyles,
        });
    };
}

export function chooseFuelType(fuelType) {
    return (dispatch, getState) => {
        const selectedFuelType = getState().selectedFuelType === fuelType
            ? null
            : fuelType;

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
        const selectedTransmissionType = getState().selectedTransmissionType ===
            transmissionType
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

export function clearAllFilters() {
    return (dispatch, getState) => {
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
        const compareList = util.toggleItem(getState().compareList, deal);

        dispatch({
            type: ActionTypes.TOGGLE_COMPARE,
            compareList: compareList,
        });
    };
}

export function setZipCode(zipcode) {
    return (dispatch, getState) => {
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
            type: ActionTypes.SET_ZIP_CODE,
            zipcode: zipcode,
        });
    };
}

export function requestLocationInfo() {
    return (dispatch, getState) => {
        /**
         * If we don't already have a loaded zipcode, try to get one from ipinfo.io
         */
        if (!getState().zipcode) {
            window.axios
                .get('http://ipinfo.io')
                .then(data => {
                    dispatch(receiveLocationInfo(data));
                })
                .catch(error => {
                    console.log('Error', error.message);
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
        const zipcode = data.data.postal;

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
