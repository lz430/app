import 'bootstrap';
import React from 'react';
import ReactDOM from 'react-dom';
import Configurator from 'containers/Configurator';
import FilterPage from 'containers/FilterPage';
import Financing from 'containers/Financing';
import { Provider } from 'react-redux';
import store from 'configureStore';
import ComparePage from 'containers/ComparePage';

const filterStore = store();

/**
 * Configurator
 */
Array.from(document.getElementsByTagName('Configurator')).map(element => {
    ReactDOM.render(<Configurator />, element);
});

/**
 * Filter
 */
Array.from(document.getElementsByTagName('FilterPage')).map(element => {
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
        <ComparePage deals={JSON.parse(element.getAttribute('deals'))} />,
        element
    );
});
