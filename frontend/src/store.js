import { createStore, compose, applyMiddleware } from 'redux';
import { persistStore, persistReducer } from 'redux-persist';
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

const makeConfiguredStore = function(reducer, initialState) {
    const sagaMiddleware = createSagaMiddleware();

    const store = createStore(
        reducer,
        initialState,
        composeEnhancers(applyMiddleware(sagaMiddleware, reduxThunk))
    );

    sagaMiddleware.run(rootSaga);

    return store;
};

export default (
    initialState = initialAppState,
    { isServer, req, debug, storeKey }
) => {
    if (isServer) {
        initialState = initialState || { fromServer: 'foo' };
        return makeConfiguredStore(rootReducer, initialState);
    } else {
        const { persistStore, persistReducer } = require('redux-persist');
        const storage = require('redux-persist/lib/storage').default;
        const persistConfig = {
            ...basePersistConfig,
            key: 'root',
            blacklist: ['pages', 'page', 'pricing', 'user', 'checkout'],
            storage,
        };

        const persistedReducer = persistReducer(persistConfig, rootReducer);
        const store = makeConfiguredStore(persistedReducer, initialState);

        store.__persistor = persistStore(store); // Nasty hack

        return store;
    }
};
