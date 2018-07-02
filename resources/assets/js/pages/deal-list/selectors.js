export default state => state.pages.dealList;

export const getSearchQuery = state => {
    return {
        ...state.pages.dealList.searchQuery,
        location: state.user.location,
        page: state.pages.dealList.page,
    };
};
