import React from 'react';
import { pricingType } from '../../../../core/types';

import Group from '../../../../apps/pricing/components/Group';
import Header from '../../../../apps/pricing/components/Header';
import TradeInModal from './TradeInModal';
import { Label } from 'reactstrap';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import DollarsAndCents from '../../../../components/money/DollarsAndCents';
import Value from '../../../../apps/pricing/components/Value';
import Line from '../../../../apps/pricing/components/Line';

export default class TradeIn extends React.PureComponent {
    static propTypes = {
        pricing: pricingType.isRequired,
        zipcode: PropTypes.string.isRequired,
        tradeSetValue: PropTypes.func.isRequired,
        tradeSetOwed: PropTypes.func.isRequired,
        tradeSetEstimate: PropTypes.func.isRequired,
        onCompleteTradeIn: PropTypes.func.isRequired,
    };

    state = {
        hasTrade: false,
        tradeInModalOpen: false,
    };

    toggleTradeInModal() {
        this.setState({ tradeInModalOpen: !this.state.tradeInModalOpen });
    }

    handleTradeButton(hasTrade) {
        this.setState({ hasTrade: hasTrade });

        if (hasTrade) {
            this.setState({ tradeInModalOpen: true });
        }
    }

    handleTradeComplete(value, owed, estimate) {
        this.props.onCompleteTradeIn(value, owed, estimate);
        this.setState({ tradeInModalOpen: false, hasTrade: true });
    }

    renderTradeStartCta() {
        return (
            <React.Fragment>
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
                    handleTradeComplete={this.handleTradeComplete.bind(this)}
                    isOpen={this.state.tradeInModalOpen}
                    toggle={this.toggleTradeInModal.bind(this)}
                    zipcode={this.props.zipcode}
                />
            </React.Fragment>
        );
    }

    renderTradeResults() {
        const tradeIn = this.props.pricing.tradeIn();
        return (
            <React.Fragment>
                <Line>
                    <Label>Value Of Trade</Label>
                    <Value>
                        <DollarsAndCents value={tradeIn.value} />
                    </Value>
                </Line>
                <Line>
                    <Label>Owed On Trade</Label>
                    <Value>
                        <DollarsAndCents value={tradeIn.owed} />
                    </Value>
                </Line>
            </React.Fragment>
        );
    }

    render() {
        const tradeIn = this.props.pricing.tradeIn();
        const showTradeResults = !!(
            tradeIn.estimate || tradeIn.value.getAmount()
        );

        return (
            <Group>
                <Header>Trade In</Header>
                {!showTradeResults && this.renderTradeStartCta()}
                {showTradeResults && this.renderTradeResults()}
                <hr />
            </Group>
        );
    }
}
