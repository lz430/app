/**
 * @deprecated
 *
 * @see store/api
 */
const api = {
    getApplicationStatus: purchaseId => {
        return window.axios.get('/api/application-status', {
            params: {
                purchaseId,
            },
        });
    },

    postNotifyWhenInRange: (email = null) => {
        return window.axios.post('/api/hubspot/not-in-area', { email });
    },
};

export default api;
