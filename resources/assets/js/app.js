require('./bootstrap');

import React from 'react';
import Configured from "./components/Configured";
import ReactDOM from 'react-dom';
import ModelSelector from './components/ModelSelector';

/**
 * ModelSelector
 */
const modelSelector = document.getElementById('model-selector');

if (modelSelector) {
    const makes = JSON.parse(modelSelector.dataset.makes);

    ReactDOM.render(
        <ModelSelector makes={makes} />,
        modelSelector
    );
}

/**
 * Configured
 */
const configured = document.getElementById('configured');

if (configured) {
    const version = JSON.parse(configured.dataset.version);
    const options = JSON.parse(configured.dataset.options);

    ReactDOM.render(
        <Configured version={version} options={options} />,
        configured
    );
}
