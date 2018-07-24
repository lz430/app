import React from 'react';
import { dealPricingType } from '../../types';
import Group from '../pricing/Group';
import Header from '../pricing/Header';
import Line from '../pricing/Line';
import Label from '../pricing/Label';
import Value from '../pricing/Value';

export default class CashSummary extends React.PureComponent {
    static propTypes = {
        dealPricing: dealPricingType.isRequired,
    };

    render() {
        const { dealPricing } = this.props;

        return (
            <Group>
                <Header style={{ fontSize: '1.5em' }}>Cash Summary</Header>
                <Line isImportant={true}>
                    <Label>Cash Price</Label>
                    <Value>{dealPricing.cashPrice()}</Value>
                </Line>
                <Line>
                    <Label>Taxes &amp; Fees</Label>
                    <Value>{dealPricing.taxesAndFeesTotal()}</Value>
                </Line>
            </Group>
        );
    }
}
