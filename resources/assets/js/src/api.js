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

    getLeasePayments: (dealPricing) => {
        return window.axios.get('/api/lease-payments', {
            params: {
                tax_rate: dealPricing.taxRate() * 100,
                acquisition_fee: dealPricing.acquisitionFeeValue(),
                doc_fee: dealPricing.docFeeValue(),
                rebate: dealPricing.bestOfferValue(),
                license_fee: dealPricing.licenseAndRegistrationValue(),
                cvr_fee: dealPricing.effCvrFeeValue(),
                msrp: dealPricing.msrpValue(),
                cash_advance: dealPricing.sellingPriceValue(),
                cash_due: dealPricing.allLeaseCashDueOptions(),
                terms: dealPricing.apiTerms()
            }
        });
    },
    getLeaseRates: (deal, zipcode) => {
        return window.axios.get('/api/lease-rates', {
            params: {
                vin: deal.vin,
                modelcode: deal.model_code,
                trim: deal.series,
                model: deal.model,
                make: deal.make,
                zipcode,
            },
        });
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
                include: 'features'
            }
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

    getBestOffer: (dealId, paymentType, zipcode, cancelToken) => { //dealId, paymentType, zipcode, targets, cancelToken
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
