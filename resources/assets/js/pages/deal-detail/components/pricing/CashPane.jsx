import React from 'react';
import Discount from './Discount';
import Rebates from '../../containers/pricing/rebates/Rebates';
import Line from './Line';
import Label from './Label';
import Value from './Value';
import TaxesAndFees from './TaxesAndFees';

class CashPane extends React.PureComponent {
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
                {dealPricing.bestOfferValue() > 0 && (
                    <Line>
                        <Label>Rebates Applied</Label>
                        <Value isNegative={true}>
                            {dealPricing.bestOffer()}
                        </Value>
                    </Line>
                )}
                <Rebates {...{ dealPricing }} onChange={onRebatesChange} />
                <TaxesAndFees items={dealPricing.taxesAndFees()} />

                <Line isImportant={true}>
                    <Label>Total Price</Label>
                    <Value>{dealPricing.yourPrice()}*</Value>
                </Line>
            </div>
        );
    }
}

CashPane.defaultProps = {
    onDiscountChange: (discountType, make = null) => {},
    onRebatesChange: () => {},
};

export default CashPane;
