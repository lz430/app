import httpclient from '../httpclient';

/**
 * Brochure site specific code
 */
class BrochureService {
    constructor(client) {
        this.client = client;
    }

    /**
     *
     * @param data
     * @returns {*}
     */
    contact(data) {
        return httpclient.post('/api/brochure/ticket', data);
    }
}

export default BrochureService;
