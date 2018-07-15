import React from 'react';
import miscicons from 'miscicons';
import SVGInline from 'react-svg-inline';
import Discount from './Discount';
import Rebates from '../../containers/pricing/rebates/Rebates';
import Line from './Line';
import Label from './Label';
import Value from './Value';
import TaxesAndFees from './TaxesAndFees';
import Group from './Group';
import Header from './Header';
import PropTypes from 'prop-types';
import Separator from './Separator';

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
                <Separator showIf={dealPricing.hasRebatesApplied()} />
                <Group>
                    <Header>Rebates</Header>
                    <Line>
                        <Label>Applied</Label>
                        <Value
                            isNegative={true}
                            isLoading={dealPricing.dealQuoteIsLoading()}
                        >
                            {dealPricing.bestOffer()}
                        </Value>
                    </Line>
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
                    {dealPricing.dealQuoteIsLoading() && (
                        <SVGInline svg={miscicons['loading']} />
                    )}
                    {dealPricing.dealQuoteIsLoading() || (
                        <div>
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
                    )}
                </Group>
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
