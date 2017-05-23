require('./bootstrap');

import React from 'react';
import ReactDOM from 'react-dom';
import Configurator from './components/Configurator';
import Filter from './components/Filter';

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
Array.from(document.getElementsByTagName('Filter')).map((element) => {
    ReactDOM.render(
        <Filter />,
        element
    );
});
