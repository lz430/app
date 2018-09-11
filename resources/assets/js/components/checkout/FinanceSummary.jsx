import React from 'react';
import { pricingType } from '../../types';
import Group from '../pricing/Group';
import Header from '../pricing/Header';
import Line from '../pricing/Line';
import Label from '../pricing/Label';
import Value from '../pricing/Value';
import DollarsAndCents from '../money/DollarsAndCents';

export default class FinanceSummary extends React.PureComponent {
    static propTypes = {
        pricing: pricingType.isRequired,
    };

    render() {
        const { pricing } = this.props;

        return (
            <Group>
                <Header style={{ fontSize: '1.5em' }}>Finance Summary</Header>
                <Line>
                    <Label>Term</Label>
                    <Value>{pricing.term()} months</Value>
                </Line>
                <Line isImportant={true}>
                    <Label>Down Payment</Label>
                    <Value>
                        <DollarsAndCents value={pricing.downPayment()} />
                    </Value>
                </Line>
                <Line isImportant={true}>
                    <Label>Monthly Payment</Label>
                    <Value>
                        <DollarsAndCents value={pricing.monthlyPayment()} />
                    </Value>
                </Line>
            </Group>
        );
    }
}
