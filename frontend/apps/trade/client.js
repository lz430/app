import axios from 'axios';

const typeaheadHttp = axios.create({
    baseURL: 'https://thorin-us-east-1.searchly.com',
    headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization:
            'Basic ' +
            'dHVybmNhci10d28tc25hcC1hY2Nlc3M6YnhpbXV4bXQwZm1lY3R0NmZ1Y3c4OWY3ZmhkM25zaGU=',
    },
});

const snapAPIHttp = axios.create({
    baseURL: 'https://snap-api.tradepending.com',
    headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
    },
});

export const cancelRequest = () => {
    const CancelToken = axios.CancelToken;
    return CancelToken.source();
};

class TradePendingClient {
    suggest(value) {
        const current_year = new Date().getFullYear();
        const payload = {
            size: 10,
            query: {
                bool: {
                    must_not: [
                        {
                            term: {
                                'year.raw': (current_year + 1).toString(),
                            },
                        },
                        {
                            term: {
                                'year.raw': (current_year + 2).toString(),
                            },
                        },
                        {
                            term: {
                                'year.raw': (current_year + 3).toString(),
                            },
                        },
                        {
                            term: {
                                'country.raw': 'CA',
                            },
                        },
                    ],
                    must: {
                        match: {
                            all_fields: {
                                query: value,
                                operator: 'and',
                            },
                        },
                    },
                },
            },
        };

        return typeaheadHttp.post('/vehicles_v13/_search', payload);
    }

    /**
     * Select
     * @param vehicle
     * @returns {AxiosPromise<any>}
     */
    select(vehicle) {
        vehicle.did = 'GT9GuqHqfbXZcgReH';

        return snapAPIHttp.get('/api/v3/select', {
            params: vehicle,
        });
    }

    /**
     * Details
     */
    selectDetails(vehicle) {
        vehicle.did = 'GT9GuqHqfbXZcgReH';

        return snapAPIHttp.get('/api/v3/select/details', {
            params: vehicle,
        });
    }

    /**
     * Report
     */
    report(vehicleId, zip, miles) {
        return snapAPIHttp.get('/api/v3/report', {
            params: {
                did: 'GT9GuqHqfbXZcgReH',
                vehicle_id: vehicleId,
                mileage: miles,
                zip_code: zip,
            },
        });
    }
}

export default new TradePendingClient();
