import { createStore, compose, applyMiddleware } from 'redux';
import reduxThunk from 'redux-thunk';
import createSagaMiddleware from 'redux-saga';
import rootSaga from 'sagas';
import { persistStore, persistReducer } from 'redux-persist';
import rootReducer from 'reducers';

import { windowResize } from 'actions/index';
import util from 'src/util';
import storage from 'redux-persist/lib/storage';

const urlStyle = util.getInitialBodyStyleFromUrl();
const urlSize = util.getInitialSizeFromUrl();

const initialState = {
    /*
    pages: {
        dealDetails: {
            finance: {
                downPayment: null,
                term: null,
            },
            lease: {
                cashDue: {},
                term: {},
                annualMileage: {},
            },
            selectDiscount: {
                discountType: 'dmr',
                employeeBrand: false,
                supplierBrand: false,
            },
        },
    },
    */
};

const config = {
    key: 'root',
    storage,
    blacklist: ['pages'],
};

export default () => {
    const composeEnhancers =
        window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

    const sagaMiddleware = createSagaMiddleware();

    const store = createStore(
        persistReducer(config, rootReducer),
        initialState,
        composeEnhancers(applyMiddleware(sagaMiddleware, reduxThunk))
    );

    sagaMiddleware.run(rootSaga);

    const persistor = persistStore(store, null, () => {
        window.addEventListener('resize', () => {
            store.dispatch(windowResize(window.innerWidth));
        });
    });
    return { store, persistor };
};
