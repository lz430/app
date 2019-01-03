import httpclient from '../httpclient';

/**
 * checkout specific API calls.
 */
export default class CheckoutService {
    constructor(client) {
        this.client = client;
    }

    /**
     * @param dealId
     * @param strategy
     * @param quote
     * @param amounts
     * @param trade
     * @returns {*}
     */
    start = (dealId, strategy, quote, amounts, trade) => {
        let payload = {
            deal_id: dealId,
            strategy: strategy,
            quote: quote,
            amounts: amounts,
            trade: trade,
        };

        return httpclient.post('/api/checkout/start', payload, {
            headers: this.client.headers(),
        });
    };

    /**
     *
     * @param purchaseId
     * @param token
     * @param email
     * @param drivers_license_state
     * @param drivers_license_number
     * @param first_name
     * @param last_name
     * @param phone_number
     * @param g_recaptcha_response
     * @returns {*}
     */
    contact = (
        purchaseId,
        token,
        email,
        drivers_license_state,
        drivers_license_number,
        first_name,
        last_name,
        phone_number,
        g_recaptcha_response
    ) => {
        let payload = {
            order_token: token,
            email,
            drivers_license_state,
            drivers_license_number,
            first_name,
            last_name,
            phone_number,
            g_recaptcha_response,
        };

        return httpclient.post(`/api/checkout/${purchaseId}/contact`, payload, {
            headers: this.client.headers(),
        });
    };

    /**
     *
     * @param purchaseId
     * @returns {*}
     */
    getFinancing = purchaseId => {
        return httpclient.get(`/api/checkout/${purchaseId}/financing`, {
            headers: this.client.headers(),
        });
    };

    /**
     *
     * @param purchaseId
     * @returns {*}
     */
    financingComplete = purchaseId => {
        return httpclient.post(
            `/api/checkout/${purchaseId}/financing`,
            {},
            {
                headers: this.client.headers(),
            }
        );
    };

    orderList = () => {
        return httpclient.get(`/api/order`, {
            headers: this.client.headers(),
        });
    };
}
