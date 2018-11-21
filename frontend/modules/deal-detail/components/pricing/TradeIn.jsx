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

    handleValueChange(e) {
        this.props.tradeSetValue(e.target.value);
    }

    handleOwedChange(e) {
        this.props.tradeSetOwed(e.target.value);
    }

    render() {
        return (
            <Group>
                <Header>Trade In</Header>
                {/*<div className="cart__trade-start text-center">
                    <Button outline>Add a Trade-In</Button>
                </div>*/}
                <Row>
                    <Col>
                        <FormGroup>
                            <Label for="value">Value</Label>
                            <Input
                                type="number"
                                name="value"
                                id="value"
                                placeholder="0"
                                value={
                                    this.props.pricing.tradeIn().value.amount
                                }
                                onChange={this.handleValueChange.bind(this)}
                            />
                        </FormGroup>
                    </Col>
                    <Col>
                        <FormGroup>
                            <Label for="owed">Amount Owed</Label>
                            <Input
                                type="number"
                                name="owed"
                                id="owed"
                                placeholder="0"
                                value={this.props.pricing.tradeIn().owed.amount}
                                onChange={this.handleOwedChange.bind(this)}
                            />
                        </FormGroup>
                    </Col>
                </Row>
                <hr />
            </Group>
        );
    }
}
