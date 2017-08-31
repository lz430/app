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
    const filterStore = store();

    ReactDOM.render(
        <Provider store={filterStore}>
            <FilterPage />
        </Provider>,
        element
    );
});

/**
 * Financing
 */
Array.from(document.getElementsByTagName('Financing')).map(element => {
    ReactDOM.render(<Financing purchase={DeliverMyRide.purchase} />, element);
});

/**
 * ComparePage
 */
Array.from(document.getElementsByTagName('ComparePage')).map(element => {
    const compareStore = store();

    ReactDOM.render(
        <Provider store={compareStore}>
            <ComparePage
                deals={JSON.parse(element.getAttribute('deals')).data}
            />
        </Provider>,
        element
    );
});

/**
 * DealDetails
 */
Array.from(document.getElementsByTagName('DealDetails')).map(element => {
    ReactDOM.render(
        <DealDetails
            deal={JSON.parse(element.getAttribute('deal')).data}
            intendedRoute={window.location.pathname}
        />,
        element
    );
});
