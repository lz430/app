import React, { Component } from 'react';
import PropTypes from 'prop-types';

import {
    Row,
    Col,
    Card,
    CardBody,
    Button,
    FormGroup,
    Label,
    Input,
} from 'reactstrap';

class StepTradeLien extends Component {
    static propTypes = {
        onConfirmValue: PropTypes.func.isRequired,
    };

    state = {
        value: 0,
    };

    onValueChange(value) {
        this.setState({ value: value });
    }

    onValueConfirm() {
        this.props.onConfirmValue(this.state.value);
    }

    render() {
        if (this.state.owesMoney === null) {
            return this.renderOwesMoneyQuestion();
        }

        return (
            <React.Fragment>
                <Row>
                    <Col>
                        <h3>Input the value of your vehicle</h3>
                    </Col>
                </Row>
                <Row className="mr-auto ml-auto">
                    <Col>
                        <Card className="mb-2">
                            <CardBody className="p-2">
                                Lorem ipsum dolor sit amet, consectetur
                                adipiscing elit. Vestibulum eros ligula, congue
                                eu dictum vel, condimentum at lectus. Nunc
                                luctus velit et augue pretium, in elementum
                                ligula aliquam.
                                <FormGroup className="mt-3">
                                    <Label for="first_name">
                                        Value Of Vehicle
                                    </Label>
                                    <Input
                                        type="number"
                                        min="1"
                                        onChange={e => {
                                            this.onValueChange(e.target.value);
                                        }}
                                        value={this.state.value}
                                        required
                                    />
                                </FormGroup>
                            </CardBody>
                        </Card>
                        <Button
                            color="primary"
                            onClick={() => this.onValueConfirm()}
                        >
                            Next: Confirm
                        </Button>
                    </Col>
                </Row>
            </React.Fragment>
        );
    }
}

export default StepTradeLien;
