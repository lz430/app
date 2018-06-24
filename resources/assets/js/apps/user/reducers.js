import * as ActionTypes from './consts';

const initialState = {
    location: {
        latitude: null,
        longitude: null,
        zipcode: null,
        city: null,
        in_range: false,
    },
};

export default function(state = initialState, action = {}) {
    switch (action.type) {
        case ActionTypes.SET_ZIP_CODE:
            return {
                ...state,
                location: {
                    ...state.location,
                    zipcode: action.zipcode,
                    city: null,
                },
            };

        case ActionTypes.RECEIVE_LOCATION_INFO:
            if (!action.data || !action.data.zip) {
                return {
                    ...state,
                    location: {
                        ...state.location,
                        in_range: false,
                    },
                };
            } else {
                return {
                    ...state,
                    location: {
                        latitude: action.data.latitude,
                        longitude: action.data.longitude,
                        zipcode: action.data.zip,
                        city: action.data.city,
                    },
                };
            }

        case ActionTypes.SET_ZIP_IN_RANGE:
            return {
                ...state,
                location: {
                    ...state.location,
                    in_range: action.supported,
                },
            };

        default:
            return state;
    }
}
