import httpclient, { sessionClient } from '../httpclient';

/**
 * User specific API calls.
 */
class UserService {
    client;

    constructor(client) {
        this.client = client;
    }

    /**
     *
     * @param email
     * @param password
     * @returns {*}
     */
    login(email, password) {
        return httpclient.post('/api/auth/login', {
            email: email,
            password: password,
        });
    }

    me = () => {
        const token = this.client.token();
        console.log(token);
        return httpclient.get('/api/auth/user', {
            headers: { Authorization: 'Bearer ' + token['token'] },
        });
    };

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

    /**
     * Calls the express session storage url. Used for the client set info in the session.
     * @param data
     * @returns {*}
     */
    setSession(data) {
        return sessionClient.post('/session', data);
    }
}

export default UserService;
