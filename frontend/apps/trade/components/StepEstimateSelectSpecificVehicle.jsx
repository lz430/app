import React, { Component } from 'react';
import PropTypes from 'prop-types';

import {
    Row,
    Col,
    ListGroup,
    ListGroupItem,
    Card,
    CardBody,
    Button,
} from 'reactstrap';
import TradePendingClient from '../../../apps/trade/client';
import { equals } from 'ramda';

class StepEstimateSelectSpecificVehicle extends Component {
    static propTypes = {
        onSpecificVehicleSelect: PropTypes.func.isRequired,
        vehicle: PropTypes.object,
    };

    state = {
        options: [],
    };

    componentDidMount() {
        if (this.props.vehicle) {
            this.fetchOptions();
        }
    }

    componentDidUpdate(prevProps) {
        if (
            !equals(prevProps.vehicle, this.props.vehicle) &&
            this.props.vehicle
        ) {
            this.fetchOptions();
        }
    }

    fetchOptions() {
        TradePendingClient.selectDetails(this.props.vehicle).then(res => {
            if (res.data.details.length > 1) {
                this.setState({ options: res.data.details });
            } else {
                this.props.onSpecificVehicleSelect(res.data.details[0]);
            }
        });
    }

    render() {
        return (
            <Row className="mt-5">
                {this.state.options.map(item => {
                    return (
                        <Col md={3} key={item.id}>
                            <Card className="mb-2">
                                <CardBody className="p-2">
                                    <ListGroup className="text-sm mb-2">
                                        <ListGroupItem className="p-1">
                                            <strong>ID:</strong> {item.id}
                                        </ListGroupItem>
                                        <ListGroupItem className="p-1">
                                            <strong>Year:</strong> {item.year}
                                        </ListGroupItem>
                                        <ListGroupItem className="p-1">
                                            <strong>Make:</strong> {item.make}
                                        </ListGroupItem>
                                        <ListGroupItem className="p-1">
                                            <strong>Model:</strong> {item.model}
                                        </ListGroupItem>
                                        <ListGroupItem className="p-1">
                                            <strong>Trim:</strong> {item.trim}
                                        </ListGroupItem>
                                        <ListGroupItem className="p-1">
                                            <strong>Body:</strong> {item.body}
                                        </ListGroupItem>
                                        <ListGroupItem className="p-1">
                                            <strong>Drivetrain:</strong>{' '}
                                            {item.drivetrain}
                                        </ListGroupItem>
                                        <ListGroupItem className="p-1">
                                            <strong>Engine:</strong>{' '}
                                            {item.engine}
                                        </ListGroupItem>
                                        <ListGroupItem className="p-1">
                                            <strong>Fuel Type:</strong>{' '}
                                            {item.fuel_type}
                                        </ListGroupItem>
                                    </ListGroup>

                                    <Button
                                        color="primary"
                                        block
                                        onClick={() =>
                                            this.props.onSpecificVehicleSelect(
                                                item
                                            )
                                        }
                                    >
                                        Select
                                    </Button>
                                </CardBody>
                            </Card>
                        </Col>
                    );
                })}
            </Row>
        );
    }
}

export default StepEstimateSelectSpecificVehicle;
