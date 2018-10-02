import httpclient from 'store/httpclient';

/**
 * checkout specific API calls.
 */
export default class CheckoutService {
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

    /**
     * @param email
     * @param drivers_license_state
     * @param drivers_license_number
     * @param first_name
     * @param last_name
     * @param phone_number
     * @param g_recaptcha_response
     * @returns {*}
     */
    contact(
        email,
        drivers_license_state,
        drivers_license_number,
        first_name,
        last_name,
        phone_number,
        g_recaptcha_response
    ) {
        let payload = {
            email,
            drivers_license_state,
            drivers_license_number,
            first_name,
            last_name,
            phone_number,
            'g-recaptcha-response': g_recaptcha_response,
        };

        return httpclient.post('/api/checkout/contact', payload);
    }

    /**
     *
     * @param purchaseId
     * @param token
     * @returns {*}
     */
    getFinancing(purchaseId, token) {
        return httpclient.get(`/api/checkout/${purchaseId}/financing`, {
            headers: { Authorization: 'Bearer ' + token['access_token'] },
        });
    }

    /**
     *
     * @param purchaseId
     * @param token
     * @returns {*}
     */
    financingComplete(purchaseId, token) {
        return httpclient.post(
            `/api/checkout/${purchaseId}/financing`,
            {},
            {
                headers: { Authorization: 'Bearer ' + token['access_token'] },
            }
        );
    }
}
