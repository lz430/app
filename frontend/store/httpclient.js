import axios from 'axios';
import config from '../core/config';
export default axios.create({
    baseURL: config.API_URL,
    //withCredentials: true,
    headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        //'X-CSRF-TOKEN': window.Laravel.csrfToken,
        //'X-Requested-With': 'XMLHttpRequest',
    },
});

export const cancelRequest = () => {
    const CancelToken = axios.CancelToken;
    return CancelToken.source();
};
