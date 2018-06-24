import api from 'src/api';
import util from 'src/util';
import R from 'ramda';
import * as ActionTypes from 'actiontypes/index';

export function requestDealQuote(deal) {
    console.log('requestDealQuote');
    return {
        type: ActionTypes.REQUEST_DEAL_QUOTE,
        deal: deal,
    };
}

export function toggleSearchFinancing(financing) {
    return dispatch => {
        dispatch({
            type: ActionTypes.SEARCH_CHANGE_FINANCING,
            data: financing,
        });

        dispatch({
            type: ActionTypes.SEARCH_REQUEST,
        });
    };
}

export function requestTargets(deal) {
    return (dispatch, getState) => {
        // If no zipcode has been set, do not request targets
        const zipcode = getState().common.zipcode;
        if (!zipcode) return;

        // If we already have the target data, do not re-request it
        const targetKey = util.getTargetKeyForDealAndZip(deal, zipcode);
        if (!R.isNil(getState().common.targetsAvailable[targetKey])) return;

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

export function toggleCompare(deal) {
    return (dispatch, getState) => {
        const deals = getState().common.compareList.map(R.prop('deal'));

        const nextCompareList = util.toggleItem(deals, deal).map(d => {
            return {
                deal: d,
                selectedFilters: R.propOr(
                    {
                        selectedStyles: getState().common.searchQuery.styles,
                        selectedMakes: getState().common.searchQuery.makes,
                        selectedFeatures: getState().common.searchQuery
                            .features,
                    },
                    'selectedFilters',
                    R.find(dealAndSelectedFilters => {
                        return dealAndSelectedFilters.deal.id === d.id;
                    }, getState().common.compareList)
                ),
            };
        });

        dispatch({
            type: ActionTypes.TOGGLE_COMPARE,
            compareList: nextCompareList,
        });
    };
}

export function closeMakeSelectorModal() {
    return (dispatch, getState) => {
        dispatch({
            type: ActionTypes.CLOSE_MAKE_SELECTOR_MODAL,
        });

        dispatch({
            type: ActionTypes.SEARCH_REQUEST,
        });
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
    return dispatch => {
        dispatch({
            type: ActionTypes.SELECT_TAB,
            data: tab,
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
        const zipcode = getState().common.zipcode;

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
        const zipcode = getState().common.zipcode;

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
        const zipcode = getState().common.zipcode;

        if (!zipcode) return;

        dispatch({
            type: ActionTypes.UPDATE_LEASE_CASH_DUE,
            deal,
            cashDue,
            zipcode,
        });
    };
}

export function receiveLeasePayments(dealPricing, zipcode, data) {
    return dispatch =>
        dispatch({
            type: ActionTypes.RECEIVE_LEASE_PAYMENTS,
            dealPricing,
            zipcode,
            data,
        });
}

export function receiveLeaseRates(deal, zipcode, data) {
    return dispatch =>
        dispatch({
            type: ActionTypes.RECEIVE_LEASE_RATES,
            deal,
            zipcode,
            data,
        });
}

/**
 * @deprecated
 */
export function requestBestOffer(deal) {
    return {
        type: ActionTypes.REQUEST_DEAL_QUOTE,
        deal: deal,
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

export function getBestOffersForLoadedDeals() {
    return (dispatch, getState) => {
        dispatch({ type: ActionTypes.REQUEST_ALL_BEST_OFFERS });
    };
}

export function showAccuPricingModal() {
    return {
        type: ActionTypes.SHOW_ACCUPRICING_MODAL,
    };
}

export function hideAccuPricingModal() {
    return {
        type: ActionTypes.HIDE_ACCUPRICING_MODAL,
    };
}

export function showInfoModal(dealId) {
    return {
        type: ActionTypes.SHOW_INFO_MODAL,
        dealId,
    };
}

export function hideInfoModal() {
    return {
        type: ActionTypes.HIDE_INFO_MODAL,
    };
}
