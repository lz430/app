import { createStore, compose, applyMiddleware } from 'redux';
import reduxThunk from 'redux-thunk';
import createSagaMiddleware from 'redux-saga';
import storage from 'redux-persist/lib/storage';
import { persistStore, persistReducer } from 'redux-persist';

import rootSaga from 'sagas';
import rootReducer from 'reducers';

import { windowResize } from 'apps/common/actions';

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
    blacklist: ['pages', 'page'],
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
