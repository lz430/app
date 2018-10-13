import httpclient from '../httpclient';

/**
 * User specific API calls.
 */
class UserService {
    /**
     * @param search
     * @param lat
     * @param lon
     * @returns {*}
     */
    getLocation(search = null, lat = null, lon = null) {
        let params = {};
        if (search) {
            params.search = search;
        }

        if (lat) {
            params.latitude = lat;
        }

        if (lon) {
            params.longitude = lon;
        }

        return httpclient.get('/api/location', {
            params: params,
        });
    }

    /**
     *
     * @param email
     * @returns {*}
     */
    postNotifyWhenInRange(email) {
        return httpclient.post('/api/hubspot/not-in-area', { email });
    }
}

export default UserService;
