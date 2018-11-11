import React from 'react';
import { dealPricingType } from '../../core/types';
import Group from '../../apps/pricing/components/Group';
import Line from '../../apps/pricing/components/Line';
import Label from '../../apps/pricing/components/Label';
import Value from '../../apps/pricing/components/Value';
import DollarsAndCents from '../money/DollarsAndCents';

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
                        <Value isLoading={dealPricing.quoteIsLoading()}>
                            <DollarsAndCents value={dealPricing.yourPrice()} />
                        </Value>
                    </Line>
                    <Line>
                        <Label>Down Payment</Label>
                        <Value isLoading={dealPricing.quoteIsLoading()}>
                            <DollarsAndCents
                                value={dealPricing.downPayment()}
                            />
                        </Value>
                    </Line>
                    <Line>
                        <Label>Amount Financed</Label>
                        <Value isLoading={dealPricing.quoteIsLoading()}>
                            <DollarsAndCents
                                value={dealPricing.amountFinanced()}
                            />
                        </Value>
                    </Line>
                    <Line>
                        <Label>Term</Label>
                        <Value>{dealPricing.term()} months</Value>
                    </Line>
                    <Line isSemiImportant={true}>
                        <Label>Monthly Payment</Label>
                        <Value isLoading={dealPricing.quoteIsLoading()}>
                            <DollarsAndCents
                                value={dealPricing.monthlyPayment()}
                            />
                        </Value>
                    </Line>
                </Group>
            </div>
        );
    }
}
