import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { Row, Col, ListGroup, ListGroupItem, Button } from 'reactstrap';
import TradePendingClient from '../../../apps/trade/client';
import Loading from '../../../components/Loading';
import { equals } from 'ramda';
class StepConfirmation extends Component {
    static propTypes = {
        detailedVehicle: PropTypes.object.isRequired,
        miles: PropTypes.number.isRequired,
        zipcode: PropTypes.string.isRequired,
        handleConfirmationComplete: PropTypes.func.isRequired,
    };

    state = {
        isLoading: true,
        report: null,
    };

    fetchData() {
        TradePendingClient.report(
            this.props.detailedVehicle.id,
            this.props.zipcode,
            this.props.miles
        ).then(res => {
            this.setState({ isLoading: false, report: res.data });
        });
    }

    componentDidMount() {
        if (
            this.props.detailedVehicle &&
            this.props.miles &&
            this.props.zipcode
        ) {
            this.fetchData();
        }
    }

    componentDidUpdate(prevProps) {
        if (
            this.props.detailedVehicle &&
            this.props.miles &&
            this.props.zipcode &&
            !this.state.isLoading &&
            !this.state.report &&
            !equals(this.props.detailedVehicle, prevProps.detailedVehicle)
        ) {
            this.fetchData();
        }
    }

    render() {
        if (this.state.isLoading) {
            return <Loading />;
        }

        const { report } = this.state;

        return (
            <React.Fragment>
                <Row>
                    <Col>
                        <h1>{report.report.ymmt}</h1>
                    </Col>
                </Row>
                <Row className="mt-5">
                    <Col md={4}>
                        <h3>Calculations:</h3>
                        <ListGroup className="text-sm">
                            <ListGroupItem>
                                <strong>Advertising:</strong>{' '}
                                {report.calculations.advertising}
                            </ListGroupItem>
                            <ListGroupItem>
                                <strong>Depreciation:</strong>{' '}
                                {report.calculations.depreciation}
                            </ListGroupItem>
                            <ListGroupItem>
                                <strong>Overhead:</strong>{' '}
                                {report.calculations.overhead}
                            </ListGroupItem>
                            <ListGroupItem>
                                <strong>Profit:</strong>{' '}
                                {report.calculations.profit}
                            </ListGroupItem>
                            <ListGroupItem>
                                <strong>Reconditioning:</strong>{' '}
                                {report.calculations.reconditioning}
                            </ListGroupItem>
                            <ListGroupItem>
                                <strong>Sale Discount Percent:</strong>{' '}
                                {report.calculations.sale_discount_percent}
                            </ListGroupItem>
                        </ListGroup>
                    </Col>
                    <Col md={4}>
                        <h3>Report:</h3>
                        <ListGroup className="text-sm">
                            <ListGroupItem>
                                <strong>Average Duration:</strong>{' '}
                                {report.report.average_duration}
                            </ListGroupItem>
                            <ListGroupItem>
                                <strong>Count:</strong> {report.report.count}
                            </ListGroupItem>
                            <ListGroupItem>
                                <strong>Demand Index:</strong>{' '}
                                {report.report.demand_index}
                            </ListGroupItem>
                            <ListGroupItem>
                                <strong>Mileage:</strong>{' '}
                                {report.report.mileage}
                            </ListGroupItem>
                            <ListGroupItem>
                                <strong>Radius:</strong> {report.report.radius}
                            </ListGroupItem>
                            <ListGroupItem>
                                <strong>Zipcode:</strong>{' '}
                                {report.report.zip_code}
                            </ListGroupItem>
                            <ListGroupItem>
                                <strong>Value - High:</strong>{' '}
                                {report.report.tradein.high}
                            </ListGroupItem>
                            <ListGroupItem>
                                <strong>Value - Low:</strong>{' '}
                                {report.report.tradein.low}
                            </ListGroupItem>
                            <ListGroupItem>
                                <strong>Value - Traget:</strong>{' '}
                                {report.report.tradein.target}
                            </ListGroupItem>
                        </ListGroup>
                    </Col>
                    <Col md={4}>
                        <h3>Vehicle:</h3>
                        <ListGroup className="text-sm">
                            <ListGroupItem>
                                <strong>ID:</strong> {report.vehicle.id}
                            </ListGroupItem>
                            <ListGroupItem>
                                <strong>Year:</strong> {report.vehicle.year}
                            </ListGroupItem>
                            <ListGroupItem>
                                <strong>Make:</strong> {report.vehicle.make}
                            </ListGroupItem>
                            <ListGroupItem>
                                <strong>Model:</strong> {report.vehicle.model}
                            </ListGroupItem>
                            <ListGroupItem>
                                <strong>Trim:</strong> {report.vehicle.trim}
                            </ListGroupItem>
                            <ListGroupItem>
                                <strong>Drivetrain:</strong>{' '}
                                {report.vehicle.drivetrain}
                            </ListGroupItem>
                            <ListGroupItem>
                                <strong>Engine:</strong> {report.vehicle.engine}
                            </ListGroupItem>
                            <ListGroupItem>
                                <strong>Fuel Type:</strong>{' '}
                                {report.vehicle.fuel_type}
                            </ListGroupItem>
                        </ListGroup>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <Button
                            onClick={() =>
                                this.props.handleConfirmationComplete(
                                    this.state.report
                                )
                            }
                        >
                            Next: Continue
                        </Button>
                    </Col>
                </Row>
            </React.Fragment>
        );
    }
}

export default StepConfirmation;
