import { createSelector } from 'reselect';

export default state => state.pages.dealList;

export const getSearchQuery = state => {
    return {
        ...state.pages.dealList.searchQuery,
        location: state.user.location,
        page: state.pages.dealList.page,
    };
};

export const getSearchPage = state => {
    return state.pages.dealList.page;
};

export const getLoadingSearchResults = state => {
    return state.pages.dealList.loadingSearchResults;
};

export const getShouldShowLoading = createSelector(
    [getSearchPage, getLoadingSearchResults],
    (searchPage, loadingSearchResults) => {
        return searchPage <= 1 && loadingSearchResults;
    }
);

export const getSelectedFiltersByCategory = createSelector(
    [getSearchQuery],
    searchQuery => {
        const filters = searchQuery.filters;

        if (!filters) {
            return {};
        }

        let byCategory = {};

        filters.forEach(item => {
            item = item.split(':');

            if (!byCategory[item[0]]) {
                byCategory[item[0]] = [];
            }
            byCategory[item[0]].push(item[1]);
        });

        return byCategory;
    }
);
