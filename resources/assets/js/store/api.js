import httpclient from 'store/httpclient';

class API {
    /**
     * Searches for deals and model years.
     *
     * The responses are totally different between the two calls
     * but the api call is pretty much the same.
     * @param query
     * @returns {string}
     */
    search(query) {
        let sort = query.sort.attribute;

        if (query.sort.direction === 'desc') {
            sort = '-'.sort;
        }

        let params = {
            make_ids: query.makes,
            model_ids: query.models,
            body_styles: query.styles,
            features: query.features,
            year: query.years[0],
            zipcode: query.location.zipcode,
            sort: sort,
            page: query.page,
        };

        let endpoint = '/api/deals';
        if (query.entity === 'model') {
            endpoint = '/api/dealsByModelYear';
        }

        return httpclient.get(endpoint, {
            params: params,
        });
    }

    /**
     * @param dealId
     * @param paymentType
     * @param zipcode
     * @param cancelToken
     * @returns {*}
     */
    dealGetQuote(dealId, paymentType, zipcode, cancelToken) {
        return httpclient.get(`/api/deals/${dealId}/best-offer`, {
            cancelToken: cancelToken,
            params: {
                payment_type: paymentType,
                zipcode,
            },
        });
    }

    /**
     * @param dealPricing
     * @returns {*}
     */
    dealGetLeasePayments(dealPricing, cancelToken) {
        return httpclient.get('/api/lease-payments', {
            cancelToken: cancelToken,
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
                terms: dealPricing.apiTerms(),
            },
        });
    }

    /**
     *
     * @param deal
     * @param zipcode
     * @returns {*}
     */
    dealGetLeaseRates(deal, zipcode, cancelToken) {
        return httpclient.get('/api/lease-rates', {
            cancelToken: cancelToken,
            params: {
                vin: deal.vin,
                modelcode: deal.model_code,
                trim: deal.series,
                model: deal.model,
                make: deal.make,
                zipcode,
            },
        });
    }
}

export default new API();
