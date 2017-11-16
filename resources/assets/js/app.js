import 'bootstrap';
import React from 'react';
import ReactDOM from 'react-dom';
import FilterPage from 'containers/FilterPage';
import Financing from 'containers/Financing';
// import { loadState } from 'localStorage';
import { Provider } from 'react-redux';
import store from 'configureStore';
import DealDetails from 'containers/DealDetails';
import ComparePage from 'containers/ComparePage';
import ConfirmDetails from 'containers/ConfirmDetails';
import ThankYouPage from 'containers/ThankYouPage';

// const persistedState = loadState();

/**
 * Filter
 */
Array.from(document.getElementsByTagName('FilterPage')).map(element => {
    ReactDOM.render(
        <Provider store={store()}>
            <FilterPage />
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
        <Provider store={store()}>
            <ComparePage />
        </Provider>,
        element
    );
});

/**
 * DealDetails
 */
Array.from(document.getElementsByTagName('DealDetails')).map(element => {
    ReactDOM.render(
        <Provider store={store()}>
            <DealDetails
                deal={JSON.parse(element.getAttribute('deal')).data}
                intendedRoute={window.location.pathname}
            />
        </Provider>,
        element
    );
});


/**
 * ConfirmDetails
 */
Array.from(document.getElementsByTagName('ConfirmDetails')).map(element => {
    ReactDOM.render(
        <Provider store={store()}>
            <ConfirmDetails
                deal={JSON.parse(element.getAttribute('deal')).data}
                intendedRoute={window.location.pathname}
            />
        </Provider>,
        element
    );
});

/**
 * Thank You
 */
Array.from(document.getElementsByTagName('ThankYouPage')).map(element => {
    ReactDOM.render(
        <Provider store={store()}>
            <ThankYouPage
                purchase={JSON.parse(element.getAttribute('purchase'))}
            />
        </Provider>,
        element
    );
});
