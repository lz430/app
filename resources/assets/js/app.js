require('./bootstrap');

import React from 'react';
import Configured from "./components/Configured";
import ReactDOM from 'react-dom';
import ModelSelector from './components/ModelSelector';

/**
 * ModelSelector
 */
Array.from(document.getElementsByTagName('ModelSelector')).map((modelSelector) => {
    const makes = JSON.parse(modelSelector.dataset.makes);

    ReactDOM.render(
        <ModelSelector makes={makes} />,
        modelSelector
    );
});

/**
 * Configured
 */
Array.from(document.getElementsByTagName('Configured')).map((configured) => {
    const version = JSON.parse(configured.dataset.version);
    const options = JSON.parse(configured.dataset.options);

    ReactDOM.render(
        <Configured version={version} options={options} />,
        configured
    );
});
