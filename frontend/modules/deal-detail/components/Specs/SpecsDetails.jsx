import React from 'react';
import PropTypes from 'prop-types';

import { Row, Col } from 'reactstrap';
import { dealType } from '../../../../core/types';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlusCircle, faMinusCircle } from '@fortawesome/free-solid-svg-icons';

export default class SpecsDetails extends React.PureComponent {
    static propTypes = {
        deal: dealType.isRequired,
        toggleActiveCategory: PropTypes.func.isRequired,
        values: PropTypes.array.isRequired,
        category: PropTypes.string.isRequired,
        isOpen: PropTypes.bool.isRequired,
    };

    renderItems() {
        if (!this.props.isOpen) {
            return false;
        }

        return (
            <div>
                {this.props.values.map((item, index) => (
                    <Row
                        className="deal-details__specs-detail-item"
                        key={`detail-${this.props.category}-${index}`}
                        noGutters
                    >
                        <Col
                            xs="6"
                            className="deal-details__specs capabilities text-left p-2 border-right"
                        >
                            <span>{item.label} </span>
                        </Col>
                        <Col
                            xs="6"
                            className="deal-details__specs features text-left p-2"
                        >
                            <span>{item.value} </span>
                        </Col>
                    </Row>
                ))}
            </div>
        );
    }

    render() {
        return (
            <div className="border-bottom deal-details__specs-detail">
                <h5
                    className="cursor-pointer align-items-center d-flex mb-0"
                    onClick={() =>
                        this.props.toggleActiveCategory(this.props.category)
                    }
                >
                    <FontAwesomeIcon
                        icon={this.props.isOpen ? faMinusCircle : faPlusCircle}
                    />

                    <span className="pl-2">{this.props.category}</span>
                </h5>
                {this.renderItems()}
            </div>
        );
    }
}
