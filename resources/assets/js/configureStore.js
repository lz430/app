import { createStore, compose, applyMiddleware } from 'redux';
import reduxThunk from 'redux-thunk';
import reducer from 'reducers/index';
import {
    requestMakes,
    requestBodyStyles,
    requestFeatures,
    requestLocationInfo,
} from 'actions/index';
import R from 'ramda';
import qs from 'qs';

const initialState = {
    selectedStyles: [
        R.prop('style', qs.parse(window.location.search.slice(1))),
    ],
    bodyStyles: null,
    fuelTypes: ['Gasoline', 'Flex Fuel', 'Diesel'],
    transmissionTypes: ['automatic', 'manual'],
    selectedTransmissionType: null,
    selectedFuelType: null,
    selectedMakes: [],
    selectedDeal: null,
    selectedFeatures: [],
    features: null,
    makes: null,
    dealPage: 1,
    dealPageTotal: 1,
    deals: null,
    fallbackLogoImage: '/images/dmr-logo.svg',
    fallbackDealImage: '/images/dmr-logo.svg',
    sortColumn: 'price',
    sortAscending: true,
    compareList: [],
    zipcode: null,
    fuelInternalImages: [],
    fuelExternalImages: [],
    latitude: null,
    longitude: null,
};

export default () => {
    const composeEnhancers =
        window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
    const store = createStore(
        reducer,
        initialState,
        composeEnhancers(applyMiddleware(reduxThunk))
    );

    store.dispatch(requestLocationInfo());
    store.dispatch(requestMakes());
    store.dispatch(requestBodyStyles());
    store.dispatch(requestFeatures());

    return store;
};
