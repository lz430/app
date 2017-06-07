import { createStore, compose, applyMiddleware } from 'redux';
import reduxThunk from 'redux-thunk';
import reducer from 'reducers/index';
import { requestMakes, requestBodyStyles } from 'actions/index';
import R from 'ramda';
import qs from 'qs';

const initialState = {
    selectedStyles: [
        R.prop('style', qs.parse(window.location.search.slice(1))),
    ],
    bodyStyles: null,
    fuelTypes: null,
    transmissionTypes: ['automatic', 'manual'],
    selectedTransmissionType: null,
    selectedFuelTypes: [],
    selectedMakes: [],
    makes: null,
    dealPage: 1,
    dealsPagination: null,
    deals: null,
    fallbackLogoImage: '/images/dmr-logo.svg',
    fallbackDealImage: '/images/dmr-logo.svg',
    sortColumn: 'price',
    sortAscending: true,
};

export default () => {
    const composeEnhancers =
        window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
    const store = createStore(
        reducer,
        initialState,
        composeEnhancers(applyMiddleware(reduxThunk))
    );

    store.dispatch(requestMakes());
    store.dispatch(requestBodyStyles());

    return store;
};
