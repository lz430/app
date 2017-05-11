require('./bootstrap');

import React from 'react';
import ReactDOM from 'react-dom';
import Configurator from './components/Configurator';

/**
 * Configurator
 */
Array.from(document.getElementsByTagName('Configurator')).map((element) => {
    ReactDOM.render(
        <Configurator />,
        element
    );
});
