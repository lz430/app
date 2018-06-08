import { createStore, compose, applyMiddleware } from 'redux';
import reduxThunk from 'redux-thunk';
import createSagaMiddleware from 'redux-saga';
import rootSaga from './sagas';
import { persistStore, persistReducer } from 'redux-persist';
import reducer from 'reducers/index';
import {
    requestMakes,
    requestBodyStyles,
    requestFeatures,
    requestLocationInfo,
    windowResize,
} from 'actions/index';
import util from 'src/util';
import { checkZipInRange, requestFeatureCategories } from './actions/index';
import storage from 'redux-persist/lib/storage';

const urlStyle = util.getInitialBodyStyleFromUrl();
const urlSize = util.getInitialSizeFromUrl();

const initialState = {
    /** Version **/
    12: '<- increment the number to purge LocalStorage',
    /** End Version **/
    accuPricingModalIsShowing: false,
    bestOffers: [],
    bodyStyles: null,
    cancelTokens: [], // A list of tokens to cancel axios calls
    city: null,
    compareList: [],
    dealBestOffer: null,
    dealPage: 1,
    dealPageTotal: 1,
    deals: null,
    employeeBrand: false,
    fallbackLogoImage: '/images/dmr-logo-small.svg',
    featureCategories: [],
    features: null,
    filterPage: 'models',
    financeDownPayment: null,
    financeTerm: null,
    fuelTypes: ['Gasoline', 'Electric', 'Flex Fuel', 'Diesel', 'Hybrid'],
    infoModalIsShowingFor: null,
    leaseAnnualMileage: {},
    leaseTerm: {},
    leaseCashDue: {},
    makes: null,
    modelYears: null,
    models: null,
    requestingMoreDeals: false,
    requestingMoreModelYears: false,
    residualPercent: null,
    searchFeatures: [],
    segments: ['Subcompact', 'Compact', 'Mid-size', 'Full-size'],
    selectedDeal: null,

    selectedTab: 'cash',
    selectedTargets: [],
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
    transmissionTypes: ['automatic', 'manual'],
    vehicleModel: null,
    vehicleYear: null,
    window: { width: window.innerWidth },
    zipInRange: null,
    zipcode: null,
    dealsIdsWithCustomizedQuotes: [],
    leaseRatesLoaded: {},
    leaseRates: null,
    leasePaymentsLoaded: {},
    leasePayments: null,
    tasks: [],
    searchQuery: {
        entity: 'model', // deal or model depending on the page we're on.
        sort: {
            attribute: 'price',
            direction: 'asc',
        },
        location: {
            zipcode: null,
            city: null,
            in_range: false,
        },
        page: 1,
        years: [],
        makes: [],
        models: [],
        styles: urlStyle ? [urlStyle] : [],
        features: urlSize ? [urlSize] : [],
    },
};

const config = {
    key: 'primary',
    storage,
    blacklist: ['deals', 'dealPage', 'dealPageTotal', 'modelYears', 'tasks'],
};

export default () => {
    const composeEnhancers =
        window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

    const sagaMiddleware = createSagaMiddleware();

    const store = createStore(
        persistReducer(config, reducer),
        initialState,
        composeEnhancers(applyMiddleware(sagaMiddleware, reduxThunk))
    );
    sagaMiddleware.run(rootSaga);

    const persistor = persistStore(store, null, () => {
        store.dispatch(requestLocationInfo()).then(() => {
            store.dispatch(requestMakes());
            store.dispatch(requestBodyStyles());
            store.dispatch(requestFeatures());
            store.dispatch(requestFeatureCategories());

            if (store.getState().zipcode) {
                store.dispatch(checkZipInRange(store.getState().zipcode));
            }
        });

        window.addEventListener('resize', () => {
            store.dispatch(windowResize(window.innerWidth));
        });
    });

    return { store, persistor };
};
