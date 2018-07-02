import api from 'src/api';
import util from 'src/util';
import R from 'ramda';
import * as ActionTypes from './consts';

export function toggleCompare(deal) {
    return (dispatch, getState) => {
        const deals = getState().common.compareList.map(R.prop('deal'));

        const nextCompareList = util.toggleItem(deals, deal).map(d => {
            return {
                deal: d,
                selectedFilters: R.propOr(
                    {
                        selectedStyles: getState().pages.dealList.searchQuery
                            .styles,
                        selectedMakes: getState().pages.dealList.searchQuery
                            .makes,
                        selectedFeatures: getState().pages.dealList.searchQuery
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

export function selectDeal(deal) {
    return {
        type: ActionTypes.SELECT_DEAL,
        selectedDeal: deal,
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
