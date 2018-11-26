import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { Row, Col, Card, CardBody, Button } from 'reactstrap';

class StepKnownOrEstimateValue extends Component {
    static propTypes = {
        handleSelectKnownOrEstimateValue: PropTypes.func.isRequired,
    };

    render() {
        return (
            <Row className="mr-auto ml-auto">
                <Col>
                    <Card className="mb-2">
                        <CardBody className="p-2">
                            Lorem ipsum dolor sit amet, consectetur adipiscing
                            elit. Vestibulum eros ligula, congue eu dictum vel,
                            condimentum at lectus. Nunc luctus velit et augue
                            pretium, in elementum ligula aliquam.
                            <Button
                                color="primary"
                                block
                                onClick={() =>
                                    this.props.handleSelectKnownOrEstimateValue(
                                        'estimate'
                                    )
                                }
                            >
                                Estimate Value
                            </Button>
                        </CardBody>
                    </Card>
                </Col>
                <Col>
                    <Card className="mb-2">
                        <CardBody className="p-2">
                            Lorem ipsum dolor sit amet, consectetur adipiscing
                            elit. Vestibulum eros ligula, congue eu dictum vel,
                            condimentum at lectus. Nunc luctus velit et augue
                            pretium, in elementum ligula aliquam.
                            <Button
                                color="primary"
                                block
                                onClick={() =>
                                    this.props.handleSelectKnownOrEstimateValue(
                                        'know'
                                    )
                                }
                            >
                                Input Value
                            </Button>
                        </CardBody>
                    </Card>
                </Col>
            </Row>
        );
    }
}

export default StepKnownOrEstimateValue;
