import 'bootstrap';
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import configureStore from 'store';

import DealList from 'pages/deal-list/Container';
import DealDetail from 'pages/deal-detail/Container';
import ComparePage from 'pages/compare/Container';
import CheckoutConfirm from 'pages/checkout-confirm/Container';
import CheckoutFinancing from 'pages/checkout-financing/Container';
import CheckoutComplete from 'pages/checkout-complete/Container';
import App from 'components/App/App';

const { store, persistor } = configureStore();

/**
 * Filter
 */
Array.from(document.getElementsByTagName('FilterPage')).map(element => {
    ReactDOM.render(
        <Provider store={store}>
            <PersistGate loading={null} persistor={persistor}>
                <App>
                    <DealList />
                </App>
            </PersistGate>
        </Provider>,
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
                <App>
                    <ComparePage />
                </App>
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
                <App>
                    <DealDetail
                        deal={JSON.parse(element.getAttribute('deal')).data}
                        intendedRoute={window.location.pathname}
                    />
                </App>
            </PersistGate>
        </Provider>,
        element
    );
});

/**
 * Checkout - Confirm
 */
Array.from(document.getElementsByTagName('ConfirmDetails')).map(element => {
    ReactDOM.render(
        <Provider store={store}>
            <PersistGate persistor={persistor}>
                <App>
                    <CheckoutConfirm
                        deal={JSON.parse(element.getAttribute('deal')).data}
                        intendedRoute={window.location.pathname}
                    />
                </App>
            </PersistGate>
        </Provider>,
        element
    );
});

/**
 * Checkout - Financing
 */
Array.from(document.getElementsByTagName('Financing')).map(element => {
    ReactDOM.render(
        <App>
            <CheckoutFinancing
                featuredPhoto={DeliverMyRide.featuredPhoto}
                purchase={DeliverMyRide.purchase}
                user={DeliverMyRide.user}
            />
        </App>,
        element
    );
});

/**
 * Checkout - Thank you
 */
Array.from(document.getElementsByTagName('ThankYouPage')).map(element => {
    ReactDOM.render(
        <Provider store={store}>
            <PersistGate persistor={persistor}>
                <App>
                    <CheckoutComplete
                        purchase={JSON.parse(element.getAttribute('purchase'))}
                        deal={JSON.parse(element.getAttribute('deal'))}
                        features={JSON.parse(element.getAttribute('features'))}
                    />
                </App>
            </PersistGate>
        </Provider>,
        element
    );
});
