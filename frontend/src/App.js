import 'App.scss';
import React, { Component } from 'react';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import configureStore, { history } from 'store';

import DealList from 'pages/deal-list/Container';
import DealDetail from 'pages/deal-detail/Container';
import ComparePage from 'pages/compare/Container';
import CheckoutConfirm from 'pages/checkout-confirm/Container';
import CheckoutFinancing from 'pages/checkout-financing/Container';
import CheckoutComplete from 'pages/checkout-complete/Container';
import PageNotFound from 'pages/404/Container';
import DeliverMyRide from 'components/App/App';

import { Route, Switch, Redirect } from 'react-router-dom';
import { ConnectedRouter } from 'connected-react-router';

const { store, persistor } = configureStore();

class App extends Component {
    render() {
        return (
            <Provider store={store}>
                <PersistGate loading={null} persistor={persistor}>
                    <ConnectedRouter history={history}>
                        <DeliverMyRide>
                            <Switch>
                                <Redirect from="/" to="/filter" exact />
                                <Route
                                    path="/filter"
                                    exact
                                    component={DealList}
                                />
                                <Route
                                    exact
                                    path="/compare"
                                    component={ComparePage}
                                />
                                <Route
                                    exact
                                    path="/deals/:id(\d+)"
                                    component={DealDetail}
                                />
                                <Route
                                    exact
                                    path="/checkout/contact"
                                    component={CheckoutConfirm}
                                />
                                <Route
                                    exact
                                    path="/checkout/financing"
                                    component={CheckoutFinancing}
                                />
                                <Route
                                    exact
                                    path="/checkout/complete"
                                    component={CheckoutComplete}
                                />
                                <Route component={PageNotFound} />
                            </Switch>
                        </DeliverMyRide>
                    </ConnectedRouter>
                </PersistGate>
            </Provider>
        );
    }
}

export default App;
