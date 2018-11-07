import React from 'react';
import { pricingType } from '../../../core/types';
import Group from '../../pricing/components/Group';
import Header from '../../pricing/components/Header';
import Line from '../../pricing/components/Line';
import Label from '../../pricing/components/Label';
import Value from '../../pricing/components/Value';
import DollarsAndCents from '../../../components/money/DollarsAndCents';

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
