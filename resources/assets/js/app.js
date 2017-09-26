import 'bootstrap';
import React from 'react';
import ReactDOM from 'react-dom';
import FilterPage from 'containers/FilterPage';
import Financing from 'containers/Financing';
import { Provider } from 'react-redux';
import store from 'configureStore';
import ComparePage from 'containers/ComparePage';
import DealDetails from 'containers/DealDetails';

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
        element);
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
