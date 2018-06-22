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
        return httpclient.get(
            '/api/deals/' + dealPricing.id() + '/lease-payments',
            {
                cancelToken: cancelToken,
                params: {
                    rebate: dealPricing.bestOfferValue(),
                    msrp: dealPricing.msrpValue(),
                    cash_advance: dealPricing.sellingPriceValue(),
                    cash_due: dealPricing.allLeaseCashDueOptions(),
                    terms: dealPricing.apiTerms(),
                },
            }
        );
    }

    /**
     * @param deal
     * @param zipcode
     * @param cancelToken
     * @returns {*}
     */
    dealGetLeaseRates(deal, zipcode, cancelToken) {
        return httpclient.get('/api/deals/' + deal.id + '/lease-rates', {
            cancelToken: cancelToken,
            params: {
                zipcode,
            },
        });
    }
}

export default DealService;
