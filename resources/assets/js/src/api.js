const sort = (column, sortAscending) => {
    return sortAscending ? column : '-' + column;
};

const api = {
    getBodyStyles: () => {
        return window.axios.get('/api/body-styles');
    },
    getMakes: () => {
        return window.axios.get('/api/makes');
    },
    getDeals: ({
        makeIds,
        bodyStyles,
        fuelTypes,
        transmissionType,
        includes,
        sortColumn,
        sortAscending,
        page,
    }) => {
        return window.axios.get('/api/deals', {
            params: {
                make_ids: makeIds,
                body_styles: bodyStyles,
                fuel_types: fuelTypes,
                transmission_type: transmissionType,
                includes,
                sort: sort(sortColumn, sortAscending),
                page,
            },
        });
    },
};

export default api;
