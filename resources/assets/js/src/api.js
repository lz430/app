const api = {
    getBodyStyles: () => {
        return window.axios.get('/api/body-styles');
    }
};

export default api;