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
        onConfirmMiles: PropTypes.func.isRequired,
    };

    state = {
        miles: 1,
    };

    onMilesChange(value) {
        this.setState({ miles: value });
    }

    onMilesConfirm() {
        this.props.onConfirmMiles(this.state.miles);
    }

    render() {
        if (this.state.owesMoney === null) {
            return this.renderOwesMoneyQuestion();
        }

        return (
            <React.Fragment>
                <Row>
                    <Col>
                        <h3>Please provide miles on the vehicle</h3>
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
                                <FormGroup className="mt-3">
                                    <Label for="first_name">
                                        Miles On Vehicle
                                    </Label>
                                    <Input
                                        type="number"
                                        min="1"
                                        onChange={e => {
                                            this.onMilesChange(e.target.value);
                                        }}
                                        value={this.state.miles}
                                        required
                                    />
                                </FormGroup>
                            </CardBody>
                        </Card>
                        <Button
                            color="primary"
                            onClick={() => this.onMilesConfirm()}
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
