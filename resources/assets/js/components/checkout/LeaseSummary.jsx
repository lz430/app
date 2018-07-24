import React from 'react';
import { dealPricingType } from '../../types';
import Group from '../pricing/Group';
import Header from '../pricing/Header';
import Line from '../pricing/Line';
import Label from '../pricing/Label';
import Value from '../pricing/Value';

export default class LeaseSummary extends React.PureComponent {
    static propTypes = {
        dealPricing: dealPricingType.isRequired,
    };

    render() {
        const { dealPricing } = this.props;

        return (
            <Group>
                <Header style={{ fontSize: '1.5em' }}>Lease Summary</Header>
                <Line>
                    <Label>Annual Miles</Label>
                    <Value>{dealPricing.leaseAnnualMileage()}</Value>
                </Line>
                <Line>
                    <Label>Term</Label>
                    <Value>{dealPricing.leaseTerm()} months</Value>
                </Line>
                <Line isImportant={true}>
                    <Label>Monthly Payment</Label>
                    <Value>{dealPricing.monthlyPayments()}</Value>
                </Line>
            </Group>
        );
    }
}
