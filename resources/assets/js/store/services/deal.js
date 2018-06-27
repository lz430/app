import httpclient from 'store/httpclient';

/**
 * Deal specific api calls.
 * financing / etc.
 */
class DealService {
    /**
     *
     * @param dealId
     * @param paymentType
     * @param zipcode
     * @param role
     * @param cancelToken
     * @returns {*}
     */
    dealGetQuote(dealId, paymentType, zipcode, role, cancelToken) {
        return httpclient.get(`/api/deals/${dealId}/quote`, {
            cancelToken: cancelToken,
            params: {
                payment_type: paymentType,
                zipcode: zipcode,
                role: role,
            },
        });
    }
}

export default DealService;
