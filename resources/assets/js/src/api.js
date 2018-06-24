/**
 * @deprecated
 *
 * @see store/api
 */
const api = {
    checkZipInRange: code => {
        return window.axios.get(`/api/zip-codes/${code}`);
    },

    setZip: code => {
        return window.axios.post('/zip-codes/', { code });
    },

    getDimensions: jato_vehicle_id => {
        return window.axios.get('/api/dimensions', {
            params: {
                jato_vehicle_id,
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

    getTargets: (zipcode, vin) => {
        return window.axios.get('/api/targets', {
            params: {
                zipcode,
                vin,
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

    postNotifyWhenInRange: (email = null) => {
        return window.axios.post('/api/hubspot/not-in-area', { email });
    },
};

export default api;
