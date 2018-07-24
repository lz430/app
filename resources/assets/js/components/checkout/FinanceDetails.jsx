import React from 'react';
import { dealPricingType } from '../../types';
import Group from '../pricing/Group';
import Header from '../pricing/Header';
import Line from '../pricing/Line';
import Label from '../pricing/Label';
import Value from '../pricing/Value';
import Separator from '../pricing/Separator';
import miscicons from 'miscicons';
import SVGInline from 'react-svg-inline';
import TaxesAndFees from '../pricing/TaxesAndFees';
import DiscountLabel from '../strings/DiscountLabel';

export default class FinanceDetails extends React.PureComponent {
    static propTypes = {
        dealPricing: dealPricingType.isRequired,
    };

    render() {
        const { dealPricing } = this.props;

        return (
            <div>
                <Group>
                    <Header style={{ fontSize: '1.5em' }}>
                        Finance Details
                    </Header>
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
                        <Label>Selling Price</Label>
                        <Value>{dealPricing.sellingPrice()}*</Value>
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
                        <Label>Total Selling Price</Label>
                        <Value isLoading={dealPricing.dealQuoteIsLoading()}>
                            {dealPricing.yourPrice()}*
                        </Value>
                    </Line>
                </Group>
                <Separator />
                <Group isLoading={dealPricing.dealQuoteIsLoading()}>
                    <Header>Finance Terms</Header>
                    {dealPricing.dealQuoteIsLoading() && (
                        <SVGInline svg={miscicons['loading']} />
                    )}
                    {dealPricing.dealQuoteIsLoading() || (
                        <div>
                            <Line isSemiImportant={true}>
                                <Label>Down Payment</Label>
                                <Value isNegative={true}>
                                    {dealPricing.financeDownPayment()}
                                </Value>
                            </Line>
                            <Line>
                                <Label>Amount Financed</Label>
                                <Value>{dealPricing.amountFinanced()}*</Value>
                            </Line>
                        </div>
                    )}
                </Group>
            </div>
        );
    }
}
