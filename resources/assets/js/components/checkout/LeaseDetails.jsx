import React from 'react';
import { dealPricingType } from '../../types';
import Group from '../pricing/Group';
import Header from '../pricing/Header';
import Line from '../pricing/Line';
import Label from '../pricing/Label';
import Value from '../pricing/Value';
import Separator from '../pricing/Separator';
import TaxesAndFees from '../pricing/TaxesAndFees';
import DiscountLabel from '../strings/DiscountLabel';

export default class LeaseDetails extends React.PureComponent {
    static propTypes = {
        dealPricing: dealPricingType.isRequired,
    };

    render() {
        const { dealPricing } = this.props;

        return (
            <div>
                <Group>
                    <Header style={{ fontSize: '1.5em' }}>Lease Details</Header>
                    <Header>Price</Header>
                    <Line>
                        <Label>MSRP</Label>
                        <Value>{dealPricing.msrp()}</Value>
                    </Line>
                    <Line>
                        <Label>
                            <DiscountLabel dealPricing={dealPricing} />
                        </Label>
                        <Value isNegative={true}>
                            {dealPricing.discount()}
                        </Value>
                    </Line>
                    <Line isSectionTotal={true}>
                        <Label>Discounted Price</Label>
                        <Value>{dealPricing.discountedPrice()}</Value>
                    </Line>
                </Group>
                <Separator />
                <Group>
                    <Header>Taxes &amp; Fees</Header>
                    <TaxesAndFees items={dealPricing.taxesAndFees()} />
                    <Line isSectionTotal={true}>
                        <Label>Gross Capitalized Cost</Label>
                        <Value isLoading={dealPricing.dealQuoteIsLoading()}>
                            {dealPricing.grossCapitalizedCost()}
                        </Value>
                    </Line>
                </Group>
                <Separator />
                <Group>
                    <Header>Rebates</Header>
                    {dealPricing.hasRebatesApplied() || (
                        <Line>
                            <Label>No rebates available</Label>
                        </Line>
                    )}
                    {dealPricing.hasRebatesApplied() && (
                        <Line>
                            <Label>Applied</Label>
                            <Value
                                isNegative={true}
                                isLoading={dealPricing.dealQuoteIsLoading()}
                            >
                                {dealPricing.bestOffer()}
                            </Value>
                        </Line>
                    )}
                    <Line isSectionTotal={true}>
                        <Label>Net Capitalized Cost</Label>
                        <Value isLoading={dealPricing.dealQuoteIsLoading()}>
                            {dealPricing.netCapitalizedCost()}*
                        </Value>
                    </Line>
                </Group>
            </div>
        );
    }
}
