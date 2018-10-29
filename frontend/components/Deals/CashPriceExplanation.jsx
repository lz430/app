import React from 'react';
import { dealPricingType } from '../../core/types';
import Group from '../pricing/Group';
import Line from '../pricing/Line';
import Label from '../pricing/Label';
import Value from '../pricing/Value';

export default class CashPriceExplanation extends React.Component {
    static propTypes = {
        dealPricing: dealPricingType.isRequired,
    };
    render() {
        const { dealPricing } = this.props;

        return (
            <div>
                <Group>
                    <Line>
                        <Label>MSRP</Label>
                        <Value>{dealPricing.msrp()}</Value>
                    </Line>
                    <Line>
                        <Label>Discount</Label>
                        <Value isNegative={true}>
                            {dealPricing.discount()}
                        </Value>
                    </Line>
                    <Line isSectionTotal={true}>
                        <Label>Discounted Price</Label>
                        <Value is>{dealPricing.discountedPrice()}</Value>
                    </Line>
                </Group>
                <Group>
                    <Line>
                        <Label>Rebates Applied</Label>
                        <Value
                            isNegative={true}
                            isLoading={dealPricing.dealQuoteIsLoading()}
                        >
                            {dealPricing.bestOffer()}
                        </Value>
                    </Line>
                    <Line isImportant={true} isSectionTotal={true}>
                        <Label>Cash Price</Label>
                        <Value isLoading={dealPricing.dealQuoteIsLoading()}>
                            {dealPricing.cashPrice()}
                        </Value>
                    </Line>
                    <Line>
                        <Label>Plus Taxes &amp; Fees</Label>
                        <Value isLoading={dealPricing.dealQuoteIsLoading()}>
                            {dealPricing.taxesAndFeesTotal()}
                        </Value>
                    </Line>
                </Group>
            </div>
        );
    }
}
