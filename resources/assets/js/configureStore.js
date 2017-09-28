import { createStore, compose, applyMiddleware } from 'redux';
import reduxThunk from 'redux-thunk';
import { persistStore, autoRehydrate } from 'redux-persist';
import reducer from 'reducers/index';
import {
    requestMakes,
    requestModels,
    requestBodyStyles,
    requestFeatures,
    requestLocationInfo,
    windowResize,
} from 'actions/index';
import util from 'src/util';

const urlStyle = util.getInitialBodyStyleFromUrl();

const initialState = {
    /** Version **/
    0: '<- increment the number to purge LocalStorage',
    /** End Version **/
    window: { width: window.innerWidth },
    smallFiltersShown: false,
    showMakeSelectorModal: true,
    selectedTab: 'cash',
    downPayment: 0,
    termDuration: 60,
    annualMileage: null,
    residualPercent: null,
    selectedDeal: null,
    selectedStyles: urlStyle ? [urlStyle] : [],
    selectedModels: [],
    models: null,
    bodyStyles: null,
    fuelTypes: ['Gasoline', 'Flex Fuel', 'Diesel', 'Hybrid'],
    transmissionTypes: ['automatic', 'manual'],
    selectedTransmissionType: null,
    selectedSegment: null,
    segments: ['Subcompact', 'Compact', 'Mid-size', 'Full-size'],
    selectedFuelType: null,
    selectedMakes: [],
    selectedFeatures: [],
    selectedRebates: [],
    dealRebates: {},
    features: null,
    requestingMoreDeals: false,
    makes: null,
    dealPage: 1,
    dealPageTotal: 1,
    deals: null,
    fallbackLogoImage: '/images/dmr-logo-small.svg',
    sortColumn: 'price',
    sortAscending: true,
    compareList: [],
    zipcode: null,
    city: null,
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

    persistStore(store, {}, () => {
        window.setTimeout(() => {
            store.dispatch(requestLocationInfo());
        });
        store.dispatch(requestMakes());
        store.dispatch(requestModels());
        store.dispatch(requestBodyStyles());
        store.dispatch(requestFeatures());

        window.addEventListener('resize', () => {
            store.dispatch(windowResize(window.innerWidth));
        });
    });

    return store;
};
