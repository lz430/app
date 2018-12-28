import React from 'react';
import { dealType } from '../../../core/types';
import { Row, Col, Collapse } from 'reactstrap';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faCar,
    faPlusCircle,
    faMinusCircle,
} from '@fortawesome/free-solid-svg-icons';

export default class extends React.PureComponent {
    static propTypes = {
        deal: dealType.isRequired,
    };

    state = {
        basicFeatures: [],
        fuelEconomy: {},
        upholsteryType: null,
        category: 'Engine',
        collapse: false,
        active: false,
    };

    getVehicleData() {
        var theData = this.equipment;
        // console.log(theData);
        return theData;
    }

    toggle = () =>
        this.setState({
            collapse: !this.state.collapse,
            active: !this.state.active,
            category: this.cat,
        });

    specSetCat = category =>
        this.setState({
            category: this.category,
        });

    render() {
        const { deal } = this.props;
        // console.log(this.state);

        return (
            <React.Fragment>
                <Collapse isOpen={this.state.collapse}>
                    {this.getVehicleData().map(vehicle => (
                        <Row className="deal-details__specs accordion-body">
                            <Col
                                sm="6"
                                className="deal-details__specs capabilities text-left"
                            >
                                <span>{vehicle.label}</span>
                            </Col>
                            <Col
                                sm="6"
                                className="deal-details__specs features text-center"
                            >
                                <span>{vehicle.value}</span>
                            </Col>
                        </Row>
                    ))}
                </Collapse>
            </React.Fragment>
        );
    }
}
