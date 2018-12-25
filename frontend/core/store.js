import { createStore, compose, applyMiddleware } from 'redux';
import reduxThunk from 'redux-thunk';
import createSagaMiddleware from 'redux-saga';

import rootSaga from './sagas';
import rootReducer from './reducers';
import { basePersistConfig } from './persist';

const initialAppState = {};

const composeEnhancers =
    (typeof window !== 'undefined' &&
        window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) ||
    compose;

const sagaMiddleware = createSagaMiddleware();

const makeConfiguredStore = function(reducer, initialState) {
    const store = createStore(
        reducer,
        initialState,
        composeEnhancers(applyMiddleware(sagaMiddleware, reduxThunk))
    );

    store.runSagaTask = () => {
        store.sagaTask = sagaMiddleware.run(rootSaga);
    };

    // run the rootSaga initially
    store.runSagaTask();

    return store;
};

export default (initialState = initialAppState, options) => {
    let sessionState;
    if (options.isServer && options.req) {
        // Access to: options.req, options.res, options.query, etc (see wrapper lib)
        sessionState = options.req.session;
    }
    if (!options.isServer && document) {
        sessionState = JSON.parse(
            document.getElementById('session').textContent
        );
    }

    if (options.isServer) {
        initialState = initialState || { fromServer: 'foo' };
        initialState.session = sessionState;
        return makeConfiguredStore(rootReducer, initialState);
    } else {
        const { persistStore, persistReducer } = require('redux-persist');
        const persistConfig = {
            ...basePersistConfig,
            key: 'root',
            blacklist: [
                'pages',
                'page',
                'pricing',
                'user',
                'checkout',
                'session',
            ],
        };

        const persistedReducer = persistReducer(persistConfig, rootReducer);
        initialState.session = JSON.parse(
            document.getElementById('session').textContent
        );
        const store = makeConfiguredStore(persistedReducer, initialState);
        store.__persistor = persistStore(store); // Nasty hack
        return store;
    }
};
