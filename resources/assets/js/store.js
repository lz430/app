import { createStore, compose, applyMiddleware } from 'redux';
import { persistStore, persistReducer } from 'redux-persist';
import reduxThunk from 'redux-thunk';
import createSagaMiddleware from 'redux-saga';
import { createBrowserHistory } from 'history';
import { connectRouter, routerMiddleware } from 'connected-react-router';

import rootSaga from 'sagas';
import rootReducer from 'reducers';

import { basePersistConfig } from 'persist';

const initialState = {};

export const history = createBrowserHistory();

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const config = {
    ...basePersistConfig,
    key: 'root',
    blacklist: ['pages', 'page', 'pricing', 'user', 'checkout'],
};

export default () => {
    const sagaMiddleware = createSagaMiddleware();

    const store = createStore(
        connectRouter(history)(persistReducer(config, rootReducer)),
        initialState,
        composeEnhancers(
            applyMiddleware(
                routerMiddleware(history),
                sagaMiddleware,
                reduxThunk
            )
        )
    );

    const persistor = persistStore(store, null, () => {});

    sagaMiddleware.run(rootSaga);
    return { store, persistor };
};
