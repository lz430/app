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

    toggleActiveFaq(faqKey) {
        // If the user clicks on the open faq, close all faqss
        if (faqKey === this.state.activeFaqKey) {
            this.setState({
                activeFaqKey: false,
            });
        } else {
            this.setState({
                activeFaqKey: faqKey,
            });
        }
    }

    getVehicleData(cat) {
        var theData = this.props.vehicle.equipment;
        // console.log(theData);
        return theData;
    }

    getCategories() {
        var array = [];
        var unique = this.props.vehicle.equipment.forEach(
            v =>
                array.indexOf(v.category) === -1 ? array.push(v.category) : null
        );
        return array;
    }

    toggle = () =>
        this.setState({
            collapse: !this.state.collapse,
            active: !this.state.active,
            category: !this.state.category,
        });

    render() {
        const { deal } = this.props;
        return (
            <React.Fragment>
                {this.getCategories().map(category => (
                    <Row
                        className="deal-details__specs accoridon-heading"
                        id="specs"
                        onClick={this.toggle}
                    >
                        <Col xs="12" className="border-bottom p-15">
                            <FontAwesomeIcon
                                icon={
                                    this.state.active
                                        ? faMinusCircle
                                        : faPlusCircle
                                }
                                onClick={this.getCategories()}
                            />
                            <h5 className=""> {category} </h5>
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
                        </Col>
                    </Row>
                ))}
            </React.Fragment>
        );
    }
}
