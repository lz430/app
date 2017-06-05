const sort = (column, ascOrDesc) => {
    return ascOrDesc === 'desc' ? '-' + column : column;
};

const api = {
    getBodyStyles: () => {
        return window.axios.get('/api/body-styles');
    },
    getMakes: () => {
        return window.axios.get('/api/makes');
    },
    getDeals: ({makeIds, bodyStyles, includes, sortColumn, ascOrDesc, page}) => {
        return window.axios.get('/api/deals', {
            params: {
                make_ids: makeIds,
                body_styles: bodyStyles,
                includes,
                sort: sort(sortColumn, ascOrDesc),
                page,
            },
        });
    },
};

export default api;
