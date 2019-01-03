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
    login = (email, password) => {
        return httpclient.post(
            '/api/auth/login',
            {
                email: email,
                password: password,
            },
            {
                headers: this.client.headers(),
            }
        );
    };

    logout = () => {
        return httpclient.get('/api/auth/logout', {
            headers: this.client.headers(),
        });
    };

    /**
     * Get currently logged in user.
     * @returns {*}
     */
    me = () => {
        return httpclient.get('/api/user/me', {
            headers: this.client.headers(),
        });
    };

    /**
     * Get currently logged in user.
     * @returns {*}
     */
    update = values => {
        return httpclient.post('/api/user/update', values, {
            headers: this.client.headers(),
        });
    };

    /**
     *
     * @param values
     * @returns {*}
     */
    signup = values => {
        return httpclient.post('/api/auth/registration', values, {
            headers: this.client.headers(),
        });
    };

    passwordForgotRequest = email => {
        return httpclient.post(
            '/api/password/create',
            {
                email: email,
            },
            {
                headers: this.client.headers(),
            }
        );
    };

    /**
     *
     * @param token
     * @param email
     * @param password
     * @param password_confirmation
     * @returns {*}
     */
    passwordForgotChange = (token, email, password, password_confirmation) => {
        return httpclient.post(
            '/api/password/reset',
            {
                token: token,
                email: email,
                password: password,
                password_confirmation: password_confirmation,
            },
            {
                headers: this.client.headers(),
            }
        );
    };

    /**
     * @param search
     * @param lat
     * @param lon
     * @returns {*}
     */
    getLocation = (search = null, lat = null, lon = null) => {
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
            headers: this.client.headers(),
        });
    };

    /**
     *
     * @param email
     * @returns {*}
     */
    postNotifyWhenInRange = email => {
        return httpclient.post(
            '/api/hubspot/not-in-area',
            {
                email: email,
            },
            {
                headers: this.client.headers(),
            }
        );
    };

    /**
     * Calls the express session storage url. Used for the client set info in the session.
     * @param data
     * @param csrfToken
     * @returns {*}
     */
    setSession(data, csrfToken) {
        return sessionClient.post('/session', data, {
            headers: {
                'CSRF-Token': csrfToken,
            },
        });
    }

    /**
     * Delete session
     * @returns {*}
     */
    destroySession(csrfToken) {
        return sessionClient.post(
            '/session/destroy',
            {},
            {
                headers: {
                    'CSRF-Token': csrfToken,
                },
            }
        );
    }
}

export default UserService;
