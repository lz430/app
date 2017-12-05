const sort = (column, sortAscending) => {
    return sortAscending ? column : '-' + column;
};

const api = {
    getBodyStyles: () => {
        return window.axios.get('/api/body-styles');
    },
    checkZipInRange: code => {
        return window.axios.get(`/api/zip-codes/${code}`);
    },
    getDimensions: jato_vehicle_id => {
        return window.axios.get('/api/dimensions', {
            params: {
                jato_vehicle_id,
            },
        });
    },
    getLeaseRates: (jato_vehicle_id, zipcode) => {
        return window.axios.get('/api/lease-rates', {
            params: {
                jato_vehicle_id,
                zipcode,
            },
        });
    },
    getWarranties: jato_vehicle_id => {
        return window.axios.get('/api/warranties', {
            params: {
                jato_vehicle_id,
            },
        });
    },
    getMakes: () => {
        return window.axios.get('/api/makes');
    },
    getModels: () => {
        return window.axios.get('/api/models');
    },
    getFeatures: () => {
        return window.axios.get('/api/features');
    },
    getFuelTypes: () => {
        return window.axios.get('/api/fuel-types');
    },
    getDeals: ({
                   makeIds,
                   modelIds,
                   bodyStyles,
                   fuelType,
                   transmissionType,
                   segment,
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
                model_ids: modelIds,
                body_styles: bodyStyles,
                fuel_type: fuelType,
                transmission_type: transmissionType,
                segment: segment,
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
    getRebates: (zipcode, vin, selected_rebate_ids = []) => {
        return window.axios.get('/api/rebates', {
            params: {
                zipcode,
                vin,
                selected_rebate_ids,
            },
        });
    },
    getApplicationStatus: purchaseId => {
        return window.axios.get('/api/application-status', {
            params: {
                purchaseId,
            },
        });
    },
};

export default api;
