import * as R from 'ramda';

export const getPageState = state => state.pages.compare;

export const getEquipmentCategories = state => {
    const page = getPageState(state);

    let categories = [];
    if (page.cols[0] && page.cols[0].equipment) {
        categories = Object.keys(page.cols[0].equipment);
    }

    return categories;
};

export const getComparedDeals = state => {
    const page = getPageState(state);
    return R.pluck('deal', page.cols);
};
