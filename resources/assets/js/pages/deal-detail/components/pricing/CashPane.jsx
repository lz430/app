import React from 'react';
import Discount from './Discount';
import Rebates from './Rebates';
import Line from './Line';
import Label from './Label';
import Value from './Value';
import TaxesAndFees from './TaxesAndFees';
import Group from './Group';
import Header from './Header';
import Separator from './Separator';

export default class CashPane extends React.PureComponent {
    static defaultProps = {
        onDiscountChange: (discountType, make = null) => {},
        onRebatesChange: () => {},
    };

    render() {
        const { dealPricing, onDiscountChange, onRebatesChange } = this.props;

        return (
            <div>
                <Group>
                    <Header>Price</Header>
                    <Line>
                        <Label>MSRP</Label>
                        <Value>{dealPricing.msrp()}</Value>
                    </Line>
                    <Discount
                        {...{ dealPricing }}
                        onChange={onDiscountChange}
                    />
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
                    <Rebates {...{ dealPricing }} onChange={onRebatesChange} />
                    <Line isImportant={true} isSectionTotal={true}>
                        <Label>Total Selling Price</Label>
                        <Value isLoading={dealPricing.dealQuoteIsLoading()}>
                            {dealPricing.yourPrice()}*
                        </Value>
                    </Line>
                </Group>
            </div>
        );
    }
}
