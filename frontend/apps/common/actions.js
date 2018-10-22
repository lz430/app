import { toggleItem } from '../../pricing/util';
import { prop } from 'ramda';
import { TOGGLE_COMPARE } from './consts';

export function toggleCompare(deal) {
    return (dispatch, getState) => {
        const deals = getState().common.compareList.map(prop('deal'));

        const nextCompareList = toggleItem(deals, deal).map(d => {
            return {
                deal: d,
            };
        });

        dispatch({
            type: TOGGLE_COMPARE,
            compareList: nextCompareList,
        });
    };
}
