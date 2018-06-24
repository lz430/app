import React from 'react';
import Discount from './Discount';
import Rebates from '../../containers/pricing/rebates/Rebates';
import Line from './Line';
import Label from './Label';
import Value from './Value';

class FinancePane extends React.PureComponent {
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
                <Line>
                    <Label>Total Price</Label>
                    <Value>{dealPricing.yourPrice()}*</Value>
                </Line>
                <hr />
                <Line isSemiImportant={true}>
                    <Label>Down Payment</Label>
                    <Value>
                        <input
                            className="fancyNumberEntry"
                            type="number"
                            min="0"
                            name="down-payment"
                            value={dealPricing.financeDownPaymentValue()}
                            onChange={this.handleDownPaymentChange}
                        />
                    </Value>
                </Line>
                <Line>
                    <Label>Amount Financed</Label>
                    <Value>{dealPricing.amountFinanced()}*</Value>
                </Line>
                <Line>
                    <Label>Term Duration</Label>
                    <Value>
                        <select
                            value={dealPricing.financeTermValue()}
                            onChange={this.handleTermChange}
                        >
                            <option value="84">84</option>
                            <option value="72">72</option>
                            <option value="60">60</option>
                            <option value="48">48</option>
                            <option value="36">36</option>
                            <option value="24">24</option>
                        </select>
                    </Value>
                </Line>
                <Line isImportant={true}>
                    <Label>Monthly Payment</Label>
                    <Value>{dealPricing.monthlyPayments()}</Value>
                </Line>
            </div>
        );
    }

    handleDownPaymentChange = e => {
        this.props.onDownPaymentChange(Number(Math.max(e.target.value, 0)));
    };

    handleTermChange = e => {
        this.props.onTermChange(Number(e.target.value));
    };
}

FinancePane.defaultProps = {
    onDiscountChange: (discountType, make = null) => {},
    onRebatesChange: () => {},
    onDownPaymentChange: downPayment => {},
    onTermChange: term => {},
};

export default FinancePane;
