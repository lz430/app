import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { Row, Col, Card, CardBody, Button } from 'reactstrap';

class StepTradeLien extends Component {
    static propTypes = {
        onConfirmTradeLien: PropTypes.func.isRequired,
    };

    state = {
        owesMoney: null,
        owed: 0,
    };

    showOwedInput() {
        this.setState({ owesMoney: true });
    }

    onOwedChange(value) {
        this.setState({ owed: value });
    }

    onOwedConfirm() {
        this.props.onConfirmTradeLien(this.state.owed);
    }

    renderOwesMoneyQuestion() {
        return (
            <React.Fragment>
                <Row>
                    <Col>
                        <h3>Do you owe money on your trade in?</h3>
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
                                <Button
                                    color="primary"
                                    block
                                    onClick={() =>
                                        this.props.onConfirmTradeLien(0)
                                    }
                                >
                                    I Own This Vehicle Outright
                                </Button>
                            </CardBody>
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
                                <Button
                                    color="primary"
                                    block
                                    onClick={() => this.showOwedInput()}
                                >
                                    I Owe Money On This Vehicle
                                </Button>
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
            </React.Fragment>
        );
    }

    render() {
        if (this.state.owesMoney === null) {
            return this.renderOwesMoneyQuestion();
        }

        return (
            <React.Fragment>
                <Row>
                    <Col>
                        <h3>Do you owe money on your trade in?</h3>
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
                                <input
                                    type="number"
                                    onChange={e => {
                                        this.onOwedChange(e.target.value);
                                    }}
                                    value={this.state.owed}
                                    required
                                />
                            </CardBody>
                        </Card>
                    </Col>
                    <Button
                        color="primary"
                        onClick={() => this.onOwedConfirm()}
                    >
                        Next: Confirm Details
                    </Button>
                </Row>
            </React.Fragment>
        );
    }
}

export default StepTradeLien;
