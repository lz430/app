import 'bootstrap';
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import configureStore from 'store';

import Filter from 'pages/deal-list/Container';
import FilterBeta from 'pages/deal-list-beta/Container';
import ComparePage from 'pages/compare/Container';

import CheckoutConfirm from 'pages/checkout-confirm/Container';
import CheckoutFinancing from 'pages/checkout-financing/Container';
import CheckoutComplete from 'pages/checkout-complete/Container';

import DealDetails from 'containers/DealDetails';

const { store, persistor } = configureStore();

/**
 * Filter
 */
Array.from(document.getElementsByTagName('FilterPage')).map(element => {
    ReactDOM.render(
        <Provider store={store}>
            <PersistGate persistor={persistor}>
                <Filter />
            </PersistGate>
        </Provider>,
        element
    );
});

/**
 * Browse
 */
Array.from(document.getElementsByTagName('BrowsePage')).map(element => {
    ReactDOM.render(
        <Provider store={store}>
            <PersistGate persistor={persistor}>
                <FilterBeta />
            </PersistGate>
        </Provider>,
        element
    );
});

/**
 * Financing
 */
Array.from(document.getElementsByTagName('Financing')).map(element => {
    ReactDOM.render(
        <CheckoutFinancing
            featuredPhoto={DeliverMyRide.featuredPhoto}
            purchase={DeliverMyRide.purchase}
            user={DeliverMyRide.user}
        />,
        element
    );
});

/**
 * ComparePage
 */
Array.from(document.getElementsByTagName('ComparePage')).map(element => {
    ReactDOM.render(
        <Provider store={store}>
            <PersistGate persistor={persistor}>
                <ComparePage />
            </PersistGate>
        </Provider>,
        element
    );
});

/**
 * DealDetails
 */
Array.from(document.getElementsByTagName('DealDetails')).map(element => {
    ReactDOM.render(
        <Provider store={store}>
            <PersistGate persistor={persistor}>
                <DealDetails
                    deal={JSON.parse(element.getAttribute('deal')).data}
                    intendedRoute={window.location.pathname}
                />
            </PersistGate>
        </Provider>,
        element
    );
});

/**
 * ConfirmDetails
 */
Array.from(document.getElementsByTagName('ConfirmDetails')).map(element => {
    ReactDOM.render(
        <Provider store={store}>
            <PersistGate persistor={persistor}>
                <CheckoutConfirm
                    deal={JSON.parse(element.getAttribute('deal')).data}
                    intendedRoute={window.location.pathname}
                />
            </PersistGate>
        </Provider>,
        element
    );
});

/**
 * Thank You
 */
Array.from(document.getElementsByTagName('ThankYouPage')).map(element => {
    ReactDOM.render(
        <Provider store={store}>
            <PersistGate persistor={persistor}>
                <CheckoutComplete
                    purchase={JSON.parse(element.getAttribute('purchase'))}
                    deal={JSON.parse(element.getAttribute('deal'))}
                    features={JSON.parse(element.getAttribute('features'))}
                />
            </PersistGate>
        </Provider>,
        element
    );
});
