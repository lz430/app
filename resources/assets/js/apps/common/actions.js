import util from 'src/util';
import * as R from 'ramda';
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

export function windowResize(width) {
    return {
        type: ActionTypes.WINDOW_RESIZE,
        window: {
            width,
        },
    };
}
