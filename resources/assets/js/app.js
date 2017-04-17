require('./bootstrap');

import React from 'react';
import ReactDOM from 'react-dom';
import ModelSelector from './components/ModelSelector';

const configurator = document.getElementById('configurator');

if (configurator) {
    const makes = JSON.parse(configurator.dataset.makes);

    ReactDOM.render(
        <ModelSelector makes={makes} />,
        configurator
    );
}
