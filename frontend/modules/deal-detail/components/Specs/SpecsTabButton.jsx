import React from 'react';
import { Col } from 'reactstrap';
import PropTypes from 'prop-types';
import classNames from 'classnames';

export default class SpecsTabButton extends React.PureComponent {
    static propTypes = {
        isActive: PropTypes.bool.isRequired,
        label: PropTypes.string.isRequired,
        value: PropTypes.string.isRequired,
        handleOnClick: PropTypes.func.isRequired,
    };

    render() {
        return (
            <Col
                sm="6"
                className={classNames(
                    'deal-details__specs-tabs-tab',
                    'd-flex',
                    'justify-content-center',
                    'cursor-pointer',
                    { active: this.props.isActive }
                )}
                onClick={() => {
                    this.props.handleOnClick(this.props.value);
                }}
            >
                {this.props.label}
            </Col>
        );
    }
}
