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
        return httpclient.post('/api/brochure/ticket', data);
    }
}

export default BrochureService;
