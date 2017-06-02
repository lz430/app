require('./bootstrap');

import React from 'react';
import ReactDOM from 'react-dom';
import Configurator from './components/Configurator';
import FilterPage from './pages/FilterPage';

/**
 * Configurator
 */
Array.from(document.getElementsByTagName('Configurator')).map((element) => {
    ReactDOM.render(
        <Configurator />,
        element
    );
});

/**
 * Filter
 */
Array.from(document.getElementsByTagName('FilterPage')).map((element) => {
    ReactDOM.render(
        <FilterPage />,
        element
    );
});
