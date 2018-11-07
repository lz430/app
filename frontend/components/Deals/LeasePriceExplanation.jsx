import React from 'react';
import { dealPricingType } from '../../core/types';
import Group from '../../apps/pricing/components/Group';
import Line from '../../apps/pricing/components/Line';
import Label from '../../apps/pricing/components/Label';
import Value from '../../apps/pricing/components/Value';

export default class LeasePriceExplanation extends React.Component {
    static propTypes = {
        dealPricing: dealPricingType.isRequired,
    };
    render() {
        const { dealPricing } = this.props;

        return (
            <div>
                <Group>
                    <Line>
                        <Label>Annual Miles</Label>
                        <Value isLoading={dealPricing.dealQuoteIsLoading()}>
                            {dealPricing.leaseAnnualMileage()}
                        </Value>
                    </Line>
                    <Line>
                        <Label>Term</Label>
                        <Value isLoading={dealPricing.dealQuoteIsLoading()}>
                            {dealPricing.leaseTerm()} months
                        </Value>
                    </Line>
                    <Line isImportant={true}>
                        <Label>Monthly Payment</Label>
                        <Value isLoading={dealPricing.dealQuoteIsLoading()}>
                            {dealPricing.monthlyPayments()}*
                        </Value>
                    </Line>
                </Group>
            </div>
        );
    }
}
