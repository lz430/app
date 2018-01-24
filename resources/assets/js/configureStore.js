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
import {checkZipInRange} from "./actions/index";

const urlStyle = util.getInitialBodyStyleFromUrl();

const initialState = {
    /** Version **/
    4: '<- increment the number to purge LocalStorage',
    /** End Version **/
    annualMileage: 10000,
    bestOffers: [],
    bodyStyles: null,
    city: null,
    compareList: [],
    dealBestOffer: null,
    dealPage: 1,
    dealPageTotal: 1,
    deals: null,
    dealTargets: {},
    downPayment: 0,
    employeeBrand: false,
    fallbackLogoImage: '/images/dmr-logo-small.svg',
    features: null,
    fuelTypes: ['Gasoline', 'Electric', 'Flex Fuel', 'Diesel', 'Hybrid'],
    makes: null,
    models: null,
    requestingMoreDeals: false,
    residualPercent: null,
    smallFiltersShown: false,
    showMakeSelectorModal: true,
    segments: ['Subcompact', 'Compact', 'Mid-size', 'Full-size'],
    selectedDeal: null,
    selectedFeatures: [],
    selectedFuelType: null,
    selectedMakes: [],
    selectedModels: [],
    selectedSegment: null,
    selectedStyles: urlStyle ? [urlStyle] : [],
    selectedTab: 'cash',
    selectedTargets: [],
    selectedTransmissionType: null,
    sortAscending: true,
    sortColumn: 'price',
    targets: [],
    targetDefaults: [
        25, /// OPEN OFFER
        52,
    ],
    termDuration: 36,
    transmissionTypes: ['automatic', 'manual'],
    window: { width: window.innerWidth },
    zipcode: null,
    zipInRange: null,
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

        if (store.getState().zipcode) {
            store.dispatch(checkZipInRange(store.getState().zipcode));
        }

        window.addEventListener('resize', () => {
            store.dispatch(windowResize(window.innerWidth));
        });
    });

    return store;
};
