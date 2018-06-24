import 'bootstrap';
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import configureStore from 'store';

import Filter from 'pages/deal-list/Container';
import FilterBeta from 'pages/deal-list-beta/Container';
import ComparePage from 'pages/compare/Container';

import Financing from 'containers/Financing';
import DealDetails from 'containers/DealDetails';
import ConfirmDetails from 'containers/ConfirmDetails';
import ThankYouPage from 'containers/ThankYouPage';

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
        <Financing
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
                <ConfirmDetails
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
                <ThankYouPage
                    purchase={JSON.parse(element.getAttribute('purchase'))}
                    deal={JSON.parse(element.getAttribute('deal'))}
                    features={JSON.parse(element.getAttribute('features'))}
                />
            </PersistGate>
        </Provider>,
        element
    );
});
