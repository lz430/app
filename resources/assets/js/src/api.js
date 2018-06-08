const api = {
    getBodyStyles: () => {
        return window.axios.get('/api/body-styles');
    },

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
    getMakes: () => {
        return window.axios.get('/api/makes');
    },
    getFeatures: () => {
        return window.axios.get('/api/features');
    },
    getFeatureCategories: () => {
        return window.axios.get('/api/categories', {
            params: {
                include: 'features',
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

    /**
     * @deprecated
     */
    getBestOffer: (dealId, paymentType, zipcode, cancelToken) => {
        return window.axios.get(`/api/deals/${dealId}/best-offer`, {
            cancelToken: cancelToken.token,
            params: {
                payment_type: paymentType,
                zipcode,
            },
        });
    },
};

export default api;
