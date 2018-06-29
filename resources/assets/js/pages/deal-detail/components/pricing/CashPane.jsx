import React from 'react';
import Discount from './Discount';
import Rebates from '../../containers/pricing/rebates/Rebates';
import Line from './Line';
import Label from './Label';
import Value from './Value';
import TaxesAndFees from './TaxesAndFees';

export default class CashPane extends React.PureComponent {
    static defaultProps = {
        onDiscountChange: (discountType, make = null) => {},
        onRebatesChange: () => {},
    };

    render() {
        const { dealPricing, onDiscountChange, onRebatesChange } = this.props;

        return (
            <div>
                <Line>
                    <Label>MSRP</Label>
                    <Value>{dealPricing.msrp()}</Value>
                </Line>
                <Discount {...{ dealPricing }} onChange={onDiscountChange} />
                <Line>
                    <Label>Selling Price</Label>
                    <Value>{dealPricing.baseSellingPrice()}</Value>
                </Line>
                <TaxesAndFees items={dealPricing.taxesAndFees()} />
                {dealPricing.bestOfferValue() > 0 && (
                    <Line>
                        <Label>Rebates Applied</Label>
                        <Value isNegative={true}>
                            {dealPricing.bestOffer()}
                        </Value>
                    </Line>
                )}
                <Rebates {...{ dealPricing }} onChange={onRebatesChange} />
                <Line isImportant={true}>
                    <Label>Total Price</Label>
                    <Value>{dealPricing.yourPrice()}*</Value>
                </Line>
            </div>
        );
    }
}
