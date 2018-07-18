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
}
