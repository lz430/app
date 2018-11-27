import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { Row, Col, Card, CardBody, Button, CardFooter } from 'reactstrap';

class StepKnownOrEstimateValue extends Component {
    static propTypes = {
        handleSelectKnownOrEstimateValue: PropTypes.func.isRequired,
    };

    render() {
        return (
            <React.Fragment>
                <Row>
                    <Col>
                        <h3>Do you know the value of your vehicle?</h3>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <Card className="mb-2">
                            <CardBody className="p-2">
                                Lorem ipsum dolor sit amet, consectetur
                                adipiscing elit. Vestibulum eros ligula, congue
                                eu dictum vel, condimentum at lectus. Nunc
                                luctus velit et augue pretium, in elementum
                                ligula aliquam.
                            </CardBody>
                            <CardFooter className="p-2">
                                <Button
                                    color="primary"
                                    className="mt-2"
                                    block
                                    onClick={() =>
                                        this.props.handleSelectKnownOrEstimateValue(
                                            'estimate'
                                        )
                                    }
                                >
                                    Estimate Value
                                </Button>
                            </CardFooter>
                        </Card>
                    </Col>
                    <Col>
                        <Card className="mb-2">
                            <CardBody className="p-2">
                                Lorem ipsum dolor sit amet, consectetur
                                adipiscing elit. Vestibulum eros ligula, congue
                                eu dictum vel, condimentum at lectus. Nunc
                                luctus velit et augue pretium, in elementum
                                ligula aliquam.
                            </CardBody>
                            <CardFooter className="p-2">
                                <Button
                                    color="primary"
                                    className="mt-2"
                                    block
                                    onClick={() =>
                                        this.props.handleSelectKnownOrEstimateValue(
                                            'know'
                                        )
                                    }
                                >
                                    Input Value
                                </Button>
                            </CardFooter>
                        </Card>
                    </Col>
                </Row>
            </React.Fragment>
        );
    }
}

export default StepKnownOrEstimateValue;
