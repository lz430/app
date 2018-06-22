import React from 'react';
import Discount from "./Discount";
import Rebates from "../../containers/pricing/rebates/Rebates";
import Line from "./Line";
import Label from "./Label";
import Value from "./Value";

class LeasePane extends React.PureComponent {
    render() {
        const {dealPricing, onDiscountChange, onRebatesChange} = this.props;

        return (
            <div>
                <Line>
                    <Label>MSRP</Label>
                    <Value>{dealPricing.msrp()}</Value>
                </Line>
                <Discount {...{dealPricing}} onChange={onDiscountChange} />
                <Line>
                    <Label>Selling Price</Label>
                    <Value>{dealPricing.baseSellingPrice()}</Value>
                </Line>
                {dealPricing.bestOfferValue() > 0 &&
                <Line>
                    <Label>Rebates Applied</Label>
                    <Value isNegative={true}>{dealPricing.bestOffer()}</Value>
                </Line>
                }
                <Rebates {...{dealPricing}} onChange={onRebatesChange}/>
                <Line>
                    <Label>Total Price</Label>
                    <Value>{dealPricing.yourPrice()}*</Value>
                </Line>
                <hr />
                <Line>
                    <Label>Annual Miles</Label>
                    <Value>{dealPricing.leaseAnnualMileage()}</Value>
                </Line>
                <Line isSemiImportant={true}>
                    <Label>Cash Due</Label>
                    <Value>{dealPricing.leaseCashDue()}</Value>
                </Line>
                <Line>
                    <Label>Term Length</Label>
                    <Value>{dealPricing.financeTerm()}</Value>
                </Line>
                <Line isImportant={true}>
                    <Label>Monthly Payment</Label>
                    <Value>{dealPricing.monthlyPayments()}*</Value>
                </Line>
            </div>
        )
    }
}

LeasePane.defaultProps = {
    onDiscountChange: (discountType, make = null) => {},
    onRebatesChange: () => {}
};

export default LeasePane;