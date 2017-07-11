import { createStore, compose, applyMiddleware } from 'redux';
import reduxThunk from 'redux-thunk';
import { persistStore, autoRehydrate } from 'redux-persist';
import reducer from 'reducers/index';
import {
    requestMakes,
    requestBodyStyles,
    requestFeatures,
    requestLocationInfo,
    windowResize,
} from 'actions/index';
import util from 'src/util';

const initialState = {
    window: { width: window.innerWidth },
    smallFiltersShown: false,
    showMakeSelectorModal: true,
    selectedStyles: [util.getInitialBodyStyleFromUrl()],
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
    fallbackLogoImage: '/images/dmr-logo-small.svg',
    fallbackDealImage: '/images/dmr-logo.svg',
    sortColumn: 'price',
    sortAscending: true,
    compareList: [],
    zipcode: null,
    fuelInternalImages: [],
    fuelExternalImages: [],
};

export default () => {
    const composeEnhancers =
        window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

    const store = createStore(
        reducer,
        initialState,
        composeEnhancers(applyMiddleware(reduxThunk)),
        autoRehydrate()
    );

    persistStore(store);

    window.setTimeout(() => {
        store.dispatch(requestLocationInfo());
    });
    store.dispatch(requestMakes());
    store.dispatch(requestBodyStyles());
    store.dispatch(requestFeatures());

    window.addEventListener('resize', () => {
        store.dispatch(windowResize(window.innerWidth));
    });

    return store;
};
