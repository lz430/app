import axios from 'axios';
import config from '../core/config';
export default axios.create({
    baseURL: config.API_URL,
    headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
    },
});

export const cancelRequest = () => {
    const CancelToken = axios.CancelToken;
    return CancelToken.source();
};
