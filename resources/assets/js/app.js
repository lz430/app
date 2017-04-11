require('./bootstrap');

import React from 'react';
import ReactDOM from 'react-dom';
import ModelSelector from './components/ModelSelector';

const root = document.getElementById('configurator');
const makes = JSON.parse(root.dataset.makes);

ReactDOM.render(
    <ModelSelector makes={makes} />,
    root
);
