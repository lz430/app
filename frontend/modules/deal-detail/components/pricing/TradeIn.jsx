import React from 'react';
import { pricingType } from '../../../../core/types';

import Group from '../../../../apps/pricing/components/Group';
import Header from '../../../../apps/pricing/components/Header';

import { Button, Input, Row, Col, FormGroup, Label } from 'reactstrap';
import PropTypes from 'prop-types';

export default class TradeIn extends React.PureComponent {
    static propTypes = {
        pricing: pricingType.isRequired,
        tradeSetValue: PropTypes.func.isRequired,
        tradeSetOwed: PropTypes.func.isRequired,
        tradeSetEstimate: PropTypes.func.isRequired,
    };

    render() {
        return (
            <Group>
                <Header>Trade In</Header>
                <div className="cart__trade-start text-center">
                    <Button outline>Add a Trade-In</Button>
                </div>
                <Row>
                    <Col>
                        <FormGroup>
                            <Label for="value">Value</Label>
                            <Input
                                type="number"
                                name="value"
                                id="value"
                                placeholder="0"
                            />
                        </FormGroup>
                    </Col>
                    <Col>
                        <FormGroup>
                            <Label for="lastname">Amount Owed</Label>
                            <Input
                                type="number"
                                name="owed"
                                id="owed"
                                placeholder="0"
                            />
                        </FormGroup>
                    </Col>
                </Row>
                <hr />
            </Group>
        );
    }
}
