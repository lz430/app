import httpclient from '../httpclient';

/**
 * Brochure site specific code
 */
class BrochureService {
    /**
     *
     * @param data
     * @returns {*}
     */
    contact(data) {
        return httpclient.post('/api/brochure/contact', data);
    }
}

export default BrochureService;
