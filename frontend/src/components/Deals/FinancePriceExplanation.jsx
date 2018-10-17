import React from 'react';
import { dealPricingType } from '../../types';
import Group from '../pricing/Group';
import Line from '../pricing/Line';
import Label from '../pricing/Label';
import Value from '../pricing/Value';

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
