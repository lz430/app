import React from 'react';
import { pricingType } from '../../types';
import Group from '../pricing/Group';
import Header from '../pricing/Header';
import Line from '../pricing/Line';
import Label from '../pricing/Label';
import Value from '../pricing/Value';
import DollarsAndCents from '../money/DollarsAndCents';

export default class CashSummary extends React.PureComponent {
    static propTypes = {
        pricing: pricingType.isRequired,
    };

    render() {
        const { pricing } = this.props;

        return (
            <Group>
                <Header style={{ fontSize: '1.5em' }}>Cash Summary</Header>
                <Line isImportant={true}>
                    <Label>Cash Price</Label>
                    <Value>
                        <DollarsAndCents value={pricing.cashPrice()} />
                    </Value>
                </Line>
                <Line>
                    <Label>Taxes &amp; Fees</Label>
                    <Value>
                        <DollarsAndCents value={pricing.taxesAndFees()} />
                    </Value>
                </Line>
            </Group>
        );
    }
}
