export default state => state.pages.dealList;

export const getSearchQuery = state => {
    const query = {
        ...state.pages.dealList.searchQuery,
        location: state.user.location,
        page: state.pages.dealList.page,
    };
    return query;
};
