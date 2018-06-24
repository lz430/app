import * as ActionTypes from './consts';

const initialState = {
    location: {
        latitude: null,
        longitude: null,
        zipcode: null,
        city: null,
        has_results: false,
    },
};

export default function(state = initialState, action = {}) {
    switch (action.type) {
        case ActionTypes.RECEIVE_LOCATION:
            if (!action.data) {
                return {
                    ...state,
                    location: {
                        ...state.location,
                        has_results: false,
                    },
                };
            } else {
                return {
                    ...state,
                    location: {
                        ...state.location,
                        latitude: action.data.location.latitude,
                        longitude: action.data.location.longitude,
                        zipcode: action.data.location.zip,
                        city: action.data.location.city,
                        has_results: action.data.has_results,
                    },
                };
            }

        default:
            return state;
    }
}
