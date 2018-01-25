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
import {checkZipInRange, requestFeatureCategories} from "./actions/index";

const urlStyle = util.getInitialBodyStyleFromUrl();

const initialState = {
    /** Version **/
    4: '<- increment the number to purge LocalStorage',
    /** End Version **/
    window: { width: window.innerWidth },
    smallFiltersShown: false,
    showMakeSelectorModal: true,
    selectedTab: 'cash',
    downPayment: 0,
    termDuration: 36,
    annualMileage: 10000,
    residualPercent: null,
    selectedDeal: null,
    selectedStyles: urlStyle ? [urlStyle] : [],
    selectedModels: [],
    models: null,
    bodyStyles: null,
    fuelTypes: ['Gasoline', 'Electric', 'Flex Fuel', 'Diesel', 'Hybrid'],
    transmissionTypes: ['automatic', 'manual'],
    selectedTransmissionType: null,
    selectedSegment: null,
    segments: ['Subcompact', 'Compact', 'Mid-size', 'Full-size'],
    selectedFuelType: null,
    selectedMakes: [],
    employeeBrand: false,
    selectedFeatures: [],
    selectedRebates: [],
    dealRebates: {},
    features: null,
    featureCategories: [],
    requestingMoreDeals: false,
    makes: null,
    dealPage: 1,
    dealPageTotal: 1,
    deals: null,
    dmrFeatures: [],
    fallbackLogoImage: '/images/dmr-logo-small.svg',
    sortColumn: 'price',
    sortAscending: true,
    compareList: [],
    zipcode: null,
    zipInRange: null,
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
