import httpclient from 'store/httpclient';

/**
 * Browse specific API calls.
 */
class BrowseService {
    /**
     * Searches for deals and model years.
     *
     * The responses are totally different between the two calls
     * but the api call is pretty much the same.
     * @param query
     * @param cancelToken
     * @returns {string}
     */
    search(query, cancelToken) {
        let sort = query.sort;

        let params = {
            filters: query.filters,
            latitude: query.location.latitude,
            longitude: query.location.longitude,
            strategy: query.purchaseStrategy,
            sort: sort,
            page: query.page,
        };

        let endpoint = '/api/deals';

        if (query.entity === 'model') {
            endpoint = '/api/dealsByModelYear';
        }

        return httpclient.get(endpoint, {
            cancelToken: cancelToken,
            params: params,
        });
    }

    /**
     * @param query
     * @param cancelToken
     * @returns {*}
     */
    autocomplete(query, cancelToken) {
        let params = {
            query: query,
        };

        return httpclient.get('/api/search', {
            cancelToken: cancelToken,
            params: params,
        });
    }
}

export default BrowseService;
