import React from 'react';
import PropTypes from 'prop-types';
import Loading from 'icons/miscicons/Loading';

import Line from 'components/pricing/Line';
import Label from 'components/pricing/Label';
import Value from 'components/pricing/Value';
import TaxesAndFees from 'components/pricing/TaxesAndFees';
import Group from 'components/pricing/Group';
import Header from 'components/pricing/Header';
import Separator from 'components/pricing/Separator';

import Discount from './Discount';
import Rebates from './Rebates';

export default class FinancePane extends React.PureComponent {
    static propTypes = {
        onDiscountChange: PropTypes.func.isRequired,
        onRebatesChange: PropTypes.func.isRequired,
        onDownPaymentChange: PropTypes.func.isRequired,
        onTermChange: PropTypes.func.isRequired,
        dealPricing: PropTypes.object.isRequired,
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
                    {dealPricing.dealQuoteIsLoading() && <Loading />}
                    {dealPricing.dealQuoteIsLoading() || (
                        <div>
                            <Line isSemiImportant={true}>
                                <Label>Down Payment</Label>
                                <Value>
                                    <input
                                        className="fancyNumberEntry"
                                        type="text"
                                        name="down-payment"
                                        value={dealPricing
                                            .financeDownPaymentValue()
                                            .toLocaleString()}
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
                    )}
                </Group>
            </div>
        );
    }

    handleDownPaymentChange = e => {
        const newDownPayment = Number(
            Math.round(e.target.value.replace(/\D/g, ''), 0)
        );

        if (isNaN(newDownPayment)) {
            return;
        }

        if (newDownPayment < 0) {
            return;
        }

        const maxDownPayment = Math.round(
            this.props.dealPricing.yourPriceValue() * 0.9
        );

        if (newDownPayment > maxDownPayment) {
            this.props.onDownPaymentChange(maxDownPayment);
            return;
        }

        this.props.onDownPaymentChange(newDownPayment);
    };

    handleTermChange = e => {
        this.props.onTermChange(Number(e.target.value));
    };
}
