import React from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/pro-light-svg-icons';
import PropTypes from 'prop-types';

export default class LoadingIcon extends React.PureComponent {
    static propTypes = {
        size: PropTypes.number.isRequired,
    };

    static defaultProps = {
        size: 4,
    };
    render() {
        return (
            <div
                className="loading"
                style={{ fontSize: this.props.size + 'rem' }}
            >
                <FontAwesomeIcon
                    className="loading-icon"
                    icon={faSpinner}
                    spin={true}
                />
            </div>
        );
    }
}
