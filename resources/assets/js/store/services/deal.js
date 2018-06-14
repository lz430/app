import httpclient from 'store/httpclient';

/**
 * Browse specific API calls.
 */
class DealService {
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
     *
     * @param dealPricing
     * @param cancelToken
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
     * @param deal
     * @param zipcode
     * @param cancelToken
     * @returns {*}
     */
    dealGetLeaseRates(deal, zipcode, cancelToken) {
        return httpclient.get('/api/lease-rates', {
            cancelToken: cancelToken,
            params: {
                vin: deal.vin,
                modelcode: deal.model_code,
                trim: deal.version.trim_name,
                model: deal.model,
                make: deal.make,
                zipcode,
            },
        });
    }
}

export default DealService;
