import httpclient from 'store/httpclient';

/**
 * checkout specific API calls.
 */
class CheckoutService {
    /**
     * @param dealId
     * @param strategy
     * @param quote
     * @param amounts
     * @returns {*}
     */
    start(dealId, strategy, quote, amounts) {
        let payload = {
            deal_id: dealId,
            strategy: strategy,
            quote: quote,
            amounts: amounts,
        };

        return httpclient.post('/api/checkout/start', payload);
    }
}

export default CheckoutService;
