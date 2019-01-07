import React from 'react';
import PropTypes from 'prop-types';

import { Col } from 'reactstrap';

export default class extends React.PureComponent {
    static propTypes = {
        primary: PropTypes.string.isRequired,
        secondary: PropTypes.string.isRequired,
    };

    render() {
        return (
            <Col xs={6} md={3} className="text-center">
                <h3>{this.props.primary}</h3>
                <h6 className="mb-0 text-sm">{this.props.secondary}</h6>
            </Col>
        );
    }
}
