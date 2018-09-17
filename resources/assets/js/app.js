import 'bootstrap';
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import configureStore, { history } from 'store';

import DealList from 'pages/deal-list/Container';
import DealDetail from 'pages/deal-detail/Container';
import ComparePage from 'pages/compare/Container';
import CheckoutConfirm from 'pages/checkout-confirm/Container';
import CheckoutFinancing from 'pages/checkout-financing/Container';
import CheckoutComplete from 'pages/checkout-complete/Container';
import App from 'components/App/App';

import { Route, Switch } from 'react-router-dom';
import { ConnectedRouter } from 'connected-react-router';

const { store, persistor } = configureStore();

/*
 * App w/ React router.
 */
const DeliverMyRide = () => (
    <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
            <ConnectedRouter history={history}>
                <Switch>
                    <App>
                        <Route path="/filter" component={DealList} />
                        <Route path="/compare" component={ComparePage} />
                        <Route path="/deals/:id" component={DealDetail} />
                        <Route
                            path="/confirm/:id"
                            component={CheckoutConfirm}
                        />
                        <Route
                            path="/apply/:id"
                            component={CheckoutFinancing}
                        />
                        <Route path="/thank-you" component={CheckoutComplete} />
                    </App>
                </Switch>
            </ConnectedRouter>
        </PersistGate>
    </Provider>
);

/**
 * React App (Router Powered)
 */
Array.from(document.getElementsByTagName('ReactApp')).map(element => {
    ReactDOM.render(<DeliverMyRide />, element);
});
