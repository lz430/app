import React from 'react';
import PropTypes from 'prop-types';
import Loading from 'icons/miscicons/Loading';

import Line from 'components/pricing/Line';
import Label from 'components/pricing/Label';
import Value from 'components/pricing/Value';
import Group from 'components/pricing/Group';
import Header from 'components/pricing/Header';
import Separator from 'components/pricing/Separator';

import Discount from './Discount';
import Rebates from './Rebates';
import DollarsAndCents from '../../../../components/money/DollarsAndCents';
import { pricingType } from '../../../../types';

export default class FinancePane extends React.PureComponent {
    static propTypes = {
        onDiscountChange: PropTypes.func.isRequired,
        onRebatesChange: PropTypes.func.isRequired,
        onDownPaymentChange: PropTypes.func.isRequired,
        onTermChange: PropTypes.func.isRequired,
        pricing: pricingType.isRequired,
    };

    render() {
        const { pricing, onDiscountChange, onRebatesChange } = this.props;

        return (
            <div>
                <Group>
                    <Header>Price</Header>
                    <Line>
                        <Label>MSRP</Label>
                        <Value>
                            <DollarsAndCents value={pricing.msrp()} />
                        </Value>
                    </Line>
                    <Discount pricing={pricing} onChange={onDiscountChange} />
                    <Line isSectionTotal={true}>
                        <Label>Discounted Price</Label>
                        <Value>
                            <DollarsAndCents
                                value={pricing.discountedPrice()}
                            />
                        </Value>
                    </Line>
                </Group>
                <Separator />
                <Group>
                    <Header>Taxes &amp; Fees</Header>
                    <Line>
                        <Label>Doc Fee</Label>
                        <Value>
                            <DollarsAndCents value={pricing.docFee()} />
                        </Value>
                    </Line>
                    <Line>
                        <Label>Electronic Filing Fee</Label>
                        <Value>
                            <DollarsAndCents value={pricing.cvrFee()} />
                        </Value>
                    </Line>
                    <Line>
                        <Label>Sales Tax</Label>
                        <Value>
                            <DollarsAndCents value={pricing.salesTax()} />
                        </Value>
                    </Line>
                    <Line isSectionTotal={true}>
                        <Label>Selling Price</Label>
                        <Value>
                            <DollarsAndCents value={pricing.sellingPrice()} />*
                        </Value>
                    </Line>
                </Group>
                <Separator />
                <Group>
                    <Header>Rebates</Header>
                    <Rebates pricing={pricing} onChange={onRebatesChange} />
                    <Line isSectionTotal={true}>
                        <Label>Total Selling Price</Label>
                        <Value isLoading={pricing.quoteIsLoading()}>
                            <DollarsAndCents value={pricing.yourPrice()} />*
                        </Value>
                    </Line>
                </Group>
                <Separator />
                <Group isLoading={pricing.quoteIsLoading()}>
                    <Header>Finance Terms</Header>
                    {pricing.quoteIsLoading() && <Loading />}
                    {pricing.quoteIsLoading() || (
                        <div>
                            <Line isSemiImportant={true}>
                                <Label>Down Payment</Label>
                                <Value>
                                    <input
                                        className="fancyNumberEntry"
                                        type="text"
                                        name="down-payment"
                                        value={pricing
                                            .downPayment()
                                            .toFormat('$0,0')}
                                        onChange={this.handleDownPaymentChange}
                                    />
                                </Value>
                            </Line>
                            <Line>
                                <Label>Amount Financed</Label>
                                <Value>
                                    <DollarsAndCents
                                        value={pricing.amountFinanced()}
                                    />*
                                </Value>
                            </Line>
                            <Line>
                                <Label>Term Duration</Label>
                                <Value>
                                    <select
                                        value={pricing.term()}
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
                                <Value>
                                    <DollarsAndCents
                                        value={pricing.monthlyPayment()}
                                    />
                                </Value>
                            </Line>
                        </div>
                    )}
                </Group>
            </div>
        );
    }

    handleDownPaymentChange = e => {
        const newDownPayment = Number(
            Math.round(e.target.value.replace(/[\D.]/g, ''))
        );

        if (isNaN(newDownPayment)) {
            return;
        }

        if (newDownPayment < 0) {
            return;
        }

        const maxDownPayment = this.props.pricing.maxDownPayment();
        if (newDownPayment > maxDownPayment.getAmount() / 100) {
            this.props.onDownPaymentChange(maxDownPayment.toFormat('$0,0'));
            return;
        }

        this.props.onDownPaymentChange(newDownPayment);
    };

    handleTermChange = e => {
        this.props.onTermChange(Number(e.target.value));
    };
}
