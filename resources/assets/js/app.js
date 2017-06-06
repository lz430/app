import 'bootstrap';
import React from 'react';
import ReactDOM from 'react-dom';
import Configurator from 'components/Configurator';
import FilterPage from 'containers/FilterPage';
import { Provider } from 'react-redux';
import store from 'configureStore';

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
