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
    getFeatures: () => {
        return window.axios.get('/api/features');
    },
    getFuelTypes: () => {
        return window.axios.get('/api/fuel-types');
    },
    getDeals: ({
        makeIds,
        bodyStyles,
        fuelType,
        transmissionType,
        features,
        includes,
        sortColumn,
        sortAscending,
        page,
        latitude,
        longitude,
        zipcode,
    }) => {
        return window.axios.get('/api/deals', {
            params: {
                make_ids: makeIds,
                body_styles: bodyStyles,
                fuel_type: fuelType,
                transmission_type: transmissionType,
                features,
                includes,
                sort: sort(sortColumn, sortAscending),
                page,
                latitude,
                longitude,
                zipcode,
            },
        });
    },
};

export default api;
