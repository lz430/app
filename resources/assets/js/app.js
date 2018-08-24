import PropTypes from 'prop-types';

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

import { BrowserRouter, Route } from 'react-router-dom';
import { ConnectedRouter } from 'connected-react-router';

const { store, persistor } = configureStore();

/*
 * Legacy App
 */
const StandaloneApp = props => (
    <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
            <App>{props.children}</App>
        </PersistGate>
    </Provider>
);

/*
 * App w/ React router.
 */
const DeliverMyRide = () => (
    <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
            <App>
                <ConnectedRouter history={history}>
                    <Route path="/filter" component={DealList} />
                </ConnectedRouter>
            </App>
        </PersistGate>
    </Provider>
);

/**
 * React App (Router Powered)
 */
Array.from(document.getElementsByTagName('ReactApp')).map(element => {
    ReactDOM.render(<DeliverMyRide />, element);
});

/**
 * Filter
 */
Array.from(document.getElementsByTagName('FilterPage')).map(element => {
    ReactDOM.render(
        <StandaloneApp>
            <DealList />
        </StandaloneApp>,
        element
    );
});

/**
 * ComparePage
 */
Array.from(document.getElementsByTagName('ComparePage')).map(element => {
    ReactDOM.render(
        <StandaloneApp>
            <ComparePage />
        </StandaloneApp>,
        element
    );
});

/**
 * DealDetails
 */
Array.from(document.getElementsByTagName('DealDetails')).map(element => {
    ReactDOM.render(
        <StandaloneApp>
            <DealDetail />
        </StandaloneApp>,
        element
    );
});

/**
 * Checkout - Confirm
 */
Array.from(document.getElementsByTagName('ConfirmDetails')).map(element => {
    ReactDOM.render(
        <StandaloneApp>
            <CheckoutConfirm
                deal={JSON.parse(element.getAttribute('deal')).data}
                intendedRoute={window.location.pathname}
            />
        </StandaloneApp>,
        element
    );
});

/**
 * Checkout - Financing
 */
Array.from(document.getElementsByTagName('Financing')).map(element => {
    ReactDOM.render(
        <StandaloneApp>
            <CheckoutFinancing
                featuredPhoto={JSON.parse(
                    element.getAttribute('featuredPhoto')
                )}
                purchase={JSON.parse(element.getAttribute('purchase'))}
                user={JSON.parse(element.getAttribute('user'))}
                url={JSON.parse(element.getAttribute('url'))}
            />
        </StandaloneApp>,
        element
    );
});

/**
 * Checkout - Thank you
 */
Array.from(document.getElementsByTagName('ThankYouPage')).map(element => {
    ReactDOM.render(
        <StandaloneApp>
            <CheckoutComplete
                purchase={JSON.parse(element.getAttribute('purchase'))}
                deal={JSON.parse(element.getAttribute('deal'))}
                features={JSON.parse(element.getAttribute('features'))}
            />
        </StandaloneApp>,

        element
    );
});
