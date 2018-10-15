import { toggleItem } from 'src/util';
import * as R from 'ramda';
import * as ActionTypes from './consts';

export function toggleCompare(deal) {
    return (dispatch, getState) => {
        const deals = getState().common.compareList.map(R.prop('deal'));

        const nextCompareList = toggleItem(deals, deal).map(d => {
            return {
                deal: d,
            };
        });

        dispatch({
            type: ActionTypes.TOGGLE_COMPARE,
            compareList: nextCompareList,
        });
    };
}
