import httpclient from 'store/httpclient';

/**
 * Browse specific API calls.
 */
class BrowseService {
    getBodyStyles() {
        return httpclient.get('/api/body-styles');
    }

    getMakes() {
        return httpclient.get('/api/makes');
    }

    getFeatures() {
        return httpclient.get('/api/features');
    }

    getFeatureCategories() {
        return httpclient.get('/api/categories', {
            params: {
                include: 'features',
            },
        });
    }

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
        let sort = query.sort.attribute;

        if (query.sort.direction === 'desc') {
            sort = '-' + sort;
        }

        let params = {
            make_ids: query.makes,
            model_ids: query.models,
            body_styles: query.styles,
            features: query.features,
            year: query.years[0],
            zipcode: query.location.zipcode,
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
}

export default BrowseService;
