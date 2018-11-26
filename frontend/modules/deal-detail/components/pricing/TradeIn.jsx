import React from 'react';
import { pricingType } from '../../../../core/types';

import Group from '../../../../apps/pricing/components/Group';
import Header from '../../../../apps/pricing/components/Header';
import TradeInModal from './TradeInModal';
import { Input, Row, Col, FormGroup, Label } from 'reactstrap';
import PropTypes from 'prop-types';
import classNames from 'classnames';

export default class TradeIn extends React.PureComponent {
    static propTypes = {
        pricing: pricingType.isRequired,
        tradeSetValue: PropTypes.func.isRequired,
        tradeSetOwed: PropTypes.func.isRequired,
        tradeSetEstimate: PropTypes.func.isRequired,
    };

    state = {
        hasTrade: false,
        tradeInModalOpen: false,
    };

    handleValueChange(e) {
        this.props.tradeSetValue(e.target.value);
    }

    handleOwedChange(e) {
        this.props.tradeSetOwed(e.target.value);
    }

    toggleTradeInModal() {
        this.setState({ tradeInModalOpen: !this.state.tradeInModalOpen });
    }

    handleTradeButton(hasTrade) {
        this.setState({ hasTrade: hasTrade });

        if (hasTrade) {
            this.setState({ tradeInModalOpen: true });
        }
    }

    render() {
        return (
            <Group>
                <Header>Trade In</Header>
                <div
                    onClick={() => this.handleTradeButton(false)}
                    className={classNames(
                        'cart__tradein_button',
                        'text-center',
                        'bg-light',
                        'p-2',
                        'mb-2',
                        'border',
                        'cursor-pointer',
                        { 'border-default': this.state.hasTrade },
                        { 'border-primary': !this.state.hasTrade }
                    )}
                >
                    I do not have a vehicle to trade in
                </div>
                <div
                    onClick={() => this.handleTradeButton(true)}
                    className={classNames(
                        'cart__tradein_button',
                        'text-center',
                        'bg-light',
                        'p-2',
                        'mb-2',
                        'border',
                        'cursor-pointer',
                        { 'border-default': !this.state.hasTrade },
                        { 'border-primary': this.state.hasTrade }
                    )}
                >
                    I have a vehicle to trade in
                </div>

                <TradeInModal
                    isOpen={this.state.tradeInModalOpen}
                    toggle={this.toggleTradeInModal.bind(this)}
                />

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
