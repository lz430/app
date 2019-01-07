import axios from 'axios';
import config from '../core/config';

/**
 * API
 */
export default axios.create({
    baseURL: config.API_URL,
    headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
    },
});

/**
 * Session
 */
export const sessionClient = axios.create({
    headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
    },
    withCredentials: true,
});

export const cancelRequest = () => {
    const CancelToken = axios.CancelToken;
    return CancelToken.source();
};
