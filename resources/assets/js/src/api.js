const api = {
    getBodyStyles: () => {
        return window.axios.get('/api/body-styles');
    },
    getMakes: () => {
        return window.axios.get('/api/makes');
    },
    getDeals: (make_ids, body_styles, includes, sort, page) => {
        return window.axios.get('/api/deals', {
            params: {
                make_ids,
                body_styles,
                includes,
                sort,
                page,
            },
        });
    },
};

export default api;
