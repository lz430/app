export const getCurrentPage = state => {
    return state.page.current;
};

export const getIsPageLoading = state => {
    return state.page.isLoading;
};

export const getCurrentPageIsInCheckout = state => {
    const currentPage = state.page.current;
    return currentPage && currentPage.includes('checkout-');
};
