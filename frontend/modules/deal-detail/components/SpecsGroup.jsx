import React from 'react';
import { Row, Col, Collapse } from 'reactstrap';
import SpecsDetails from './SpecsDetails';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlusCircle, faMinusCircle } from '@fortawesome/free-solid-svg-icons';

export default class extends React.PureComponent {
    state = {
        basicFeatures: [],
        fuelEconomy: {},
        upholsteryType: null,
        category: 'Engine',
        collapse: false,
        active: null,
        activeTab: 'capabilities',
    };

    toggle = id => () => {
        this.setState({
            collapse: !this.state.collapse,
            active: id,
        });
    };

    getTheCats() {
        const specsCatsR = this.props.specs.map((item, i) => {
            return (
                <React.Fragment key={i}>
                    <Col xs="12" className="border-bottom p-15">
                        <FontAwesomeIcon
                            icon={
                                this.state.active === i
                                    ? faMinusCircle
                                    : faPlusCircle
                            }
                        />
                        <h5
                            className="collapse-header"
                            onClick={this.toggle(i)}
                        >
                            {` ${item.category} `}
                        </h5>
                        <Collapse isOpen={this.state.active === i}>
                            <SpecsDetails
                                vehicle={this.props.vehicle}
                                values={item.values}
                                category={item.category}
                            />
                        </Collapse>
                    </Col>
                </React.Fragment>
            );
        });
        return (
            <Row
                className="deal-details__specs accoridon-heading p-10"
                id="specs"
            >
                {specsCatsR}
            </Row>
        );
    }

    render() {
        return <React.Fragment>{this.getTheCats()}</React.Fragment>;
    }
}
