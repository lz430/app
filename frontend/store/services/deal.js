import httpclient from '../httpclient';

/**
 * Deal specific api calls.
 * financing / etc.
 */
class DealService {
    /**
     *
     * @param dealId
     * @param latitude
     * @param longitude
     * @returns {*}
     */
    get(dealId, latitude, longitude) {
        return httpclient.get(`/api/deals/${dealId}`, {
            params: {
                latitude: latitude,
                longitude: longitude,
            },
        });
    }

    /**
     *
     * @param dealId
     * @param paymentType
     * @param zipcode
     * @param roles
     * @param cancelToken
     * @param down
     * @param tradeValue
     * @param tradeOwed
     * @returns {*}
     */
    dealGetQuote(
        dealId,
        paymentType,
        zipcode,
        roles,
        cancelToken,
        down = 0,
        tradeValue = 0,
        tradeOwed = 0
    ) {
        return httpclient.get(`/api/deals/${dealId}/quote`, {
            cancelToken: cancelToken,
            params: {
                payment_type: paymentType,
                zipcode: zipcode,
                roles: roles,
                down: down,
                trade_value: tradeValue,
                trade_owed: tradeOwed,
            },
        });
    }

    /**
     *
     * @param dealIds
     * @returns {*}
     */
    compare(dealIds) {
        return httpclient.get(`/api/deals/compare`, {
            params: {
                deals: dealIds,
            },
        });
    }

    /**
     * @param dealId
     * @returns {*}
     */
    dealGetDimensions(dealId) {
        return httpclient.get(`/api/deals/${dealId}/dimensions`);
    }

    /**
     * @param dealId
     * @returns {*}
     */
    dealGetWarranties(dealId) {
        return httpclient.get(`/api/deals/${dealId}/warranties`);
    }
}

export default DealService;
