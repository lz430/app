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
    13: '<- increment the number to purge LocalStorage',
    accuPricingModalIsShowing: false,
    bestOffers: [],
    city: null,
    compareList: [],
    dealBestOffer: null,
    employeeBrand: false,
    fallbackLogoImage: '/images/dmr-logo-small.svg',
    featureCategories: [],
    financeDownPayment: null,
    financeTerm: null,
    infoModalIsShowingFor: null,
    leaseAnnualMileage: {},
    leaseTerm: {},
    leaseCashDue: {},
    residualPercent: null,
    selectedDeal: null,
    selectedTab: 'cash',
    selectedTargets: [],
    showMakeSelectorModal: true,
    smallFiltersShown: false,
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

    //
    // Browse / Search
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

    modelYears: [],

    dealPage: 1,
    dealPageTotal: 1,
    deals: [],

    bodyStyles: null,
    makes: null,
    models: null,
    features: null,
    searchFeatures: [],

    requestingMoreDeals: false,
    loadingSearchResults: false,
};

const config = {
    key: 'primary',
    storage,
    blacklist: ['deals', 'dealPage', 'dealPageTotal', 'modelYears'],
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
