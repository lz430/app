import axios from 'axios';

export default axios.create({
    baseURL: '',
    headers: {
        'Content-Type': 'application/json',
        'X-CSRF-TOKEN': window.Laravel.csrfToken,
        'X-Requested-With': 'XMLHttpRequest',
    },
});

export const cancelRequest = () => {
    const CancelToken = axios.CancelToken;
    return CancelToken.source();
};
