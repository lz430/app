import 'bootstrap';
import React from 'react';
import ReactDOM from 'react-dom';
import FilterPage from 'containers/FilterPage';
import Financing from 'containers/Financing';
import { Provider } from 'react-redux';
import store from 'configureStore';
import ComparePage from 'containers/ComparePage';

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
    ReactDOM.render(<Financing />, element);
});

Array.from(document.getElementsByTagName('ComparePage')).map(element => {
    ReactDOM.render(
        <ComparePage deals={JSON.parse(element.getAttribute('deals')).data} />,
        element
    );
});
