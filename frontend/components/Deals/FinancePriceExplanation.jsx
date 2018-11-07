import React from 'react';
import { dealPricingType } from '../../core/types';
import Group from '../../apps/pricing/components/Group';
import Line from '../../apps/pricing/components/Line';
import Label from '../../apps/pricing/components/Label';
import Value from '../../apps/pricing/components/Value';

export default class FinancePriceExplanation extends React.Component {
    static propTypes = {
        dealPricing: dealPricingType.isRequired,
    };
    render() {
        const { dealPricing } = this.props;

        return (
            <div>
                <Group>
                    <Line>
                        <Label>Total Selling Price</Label>
                        <Value isLoading={dealPricing.dealQuoteIsLoading()}>
                            {dealPricing.yourPrice()}
                        </Value>
                    </Line>
                    <Line isSemiImportant={true}>
                        <Label>Down Payment</Label>
                        <Value isLoading={dealPricing.dealQuoteIsLoading()}>
                            {dealPricing.financeDownPayment()}
                        </Value>
                    </Line>
                    <Line>
                        <Label>Amount Financed</Label>
                        <Value isLoading={dealPricing.dealQuoteIsLoading()}>
                            {dealPricing.amountFinanced()}
                        </Value>
                    </Line>
                    <Line>
                        <Label>Term</Label>
                        <Value>{dealPricing.financeTerm()} months</Value>
                    </Line>
                    <Line isImportant={true}>
                        <Label>Monthly Payment</Label>
                        <Value isLoading={dealPricing.dealQuoteIsLoading()}>
                            {dealPricing.monthlyPayments()}
                        </Value>
                    </Line>
                </Group>
            </div>
        );
    }
}
