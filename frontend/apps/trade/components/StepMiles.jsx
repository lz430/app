import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { Row, Col, Card, CardBody, Button } from 'reactstrap';

class StepTradeLien extends Component {
    static propTypes = {
        onConfirmMiles: PropTypes.func.isRequired,
    };

    state = {
        miles: 0,
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
            <Row className="mr-auto ml-auto">
                <Col>
                    <Card className="mb-2">
                        <CardBody className="p-2">
                            Lorem ipsum dolor sit amet, consectetur adipiscing
                            elit. Vestibulum eros ligula, congue eu dictum vel,
                            condimentum at lectus. Nunc luctus velit et augue
                            pretium, in elementum ligula aliquam.
                            <input
                                type="number"
                                onChange={e => {
                                    this.onMilesChange(e.target.value);
                                }}
                                value={this.state.miles}
                                required
                            />
                        </CardBody>
                    </Card>
                </Col>
                <Button color="primary" onClick={() => this.onMilesConfirm()}>
                    Next: Confirm
                </Button>
            </Row>
        );
    }
}

export default StepTradeLien;
