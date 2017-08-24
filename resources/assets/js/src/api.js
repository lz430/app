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
    getRebates: (category, zipcode, vin, selected_rebate_ids) => {
        return window.axios.get('/api/rebates', {
            params: {
                category,
                zipcode,
                vin,
                selected_rebate_ids,
            },
        });
    },
    getLeaseTerms: (
        vin,
        zipcode,
        annual_mileage,
        down_payment,
        msrp,
        price
    ) => {
        return window.axios.get('/api/lease', {
            params: {
                vin,
                zipcode,
                annual_mileage,
                down_payment,
                msrp,
                price,
            },
        });
    },
    getFinanceTerms: (vin, zipcode, down_payment, msrp, price) => {
        return window.axios.get('/api/finance', {
            params: {
                vin,
                zipcode,
                down_payment,
                msrp,
                price,
            },
        });
    },
};

export default api;
