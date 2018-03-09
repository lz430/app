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
import { checkZipInRange, requestFeatureCategories } from './actions/index';

const urlStyle = util.getInitialBodyStyleFromUrl();

const initialState = {
    /** Version **/
    4: '<- increment the number to purge LocalStorage',
    /** End Version **/
    annualMileage: 10000,
    bestOffers: [],
    bodyStyles: null,
    cancelTokens: [], // A list of tokens to cancel axios calls for best offers
    city: null,
    compareList: [],
    dealBestOffer: null,
    dealPage: 1,
    dealPageTotal: 1,
    deals: null,
    downPayment: 0,
    employeeBrand: false,
    fallbackLogoImage: '/images/dmr-logo-small.svg',
    featureCategories: [],
    features: null,
    filterPage: 'models',
    fuelTypes: ['Gasoline', 'Electric', 'Flex Fuel', 'Diesel', 'Hybrid'],
    makes: null,
    modelYears: null,
    models: null,
    requestingMoreDeals: false,
    requestingMoreModelYears: false,
    residualPercent: null,
    searchFeatures: [],
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
    selectedYear: null,
    showMakeSelectorModal: true,
    smallFiltersShown: false,
    sortAscending: true,
    sortColumn: 'price',
    targets: [],
    targetsAvailable: {},
    targetsSelected: {},
    /** Need to duplicate these in App\Http\Controllers\API\TargetsController::TARGET_OPEN_OFFERS **/
    targetDefaults: [
        25, // Open Offer
        36, // Finance & Lease Customer
        39, // Finance Customer
        26, // Lease Customer
        45, // Captive Finance Customer
        52, // Auto Show Cash Recipient
    ],
    termDuration: 36,
    transmissionTypes: ['automatic', 'manual'],
    vehicleModel: null,
    vehicleYear: null,
    window: { width: window.innerWidth },
    zipInRange: null,
    zipcode: null,
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
        //store.dispatch(requestModels());
        store.dispatch(requestBodyStyles());
        store.dispatch(requestFeatures());
        store.dispatch(requestFeatureCategories());

        if (store.getState().zipcode) {
            store.dispatch(checkZipInRange(store.getState().zipcode));
        }

        window.addEventListener('resize', () => {
            store.dispatch(windowResize(window.innerWidth));
        });
    });

    return store;
};
