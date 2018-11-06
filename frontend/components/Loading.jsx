import React from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/pro-light-svg-icons';

const LoadingIcon = () => (
    <div className="loading" title="5">
        <FontAwesomeIcon
            className="loading-icon"
            icon={faSpinner}
            spin={true}
        />
    </div>
);

export default LoadingIcon;
