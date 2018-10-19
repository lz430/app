import React from 'react';
import Loading from '../../components/Loading';
import { pricingType } from '../../core/types';
import Group from '../pricing/Group';
import Header from '../pricing/Header';
import Line from '../pricing/Line';
import Label from '../pricing/Label';
import Value from '../pricing/Value';
import Separator from '../pricing/Separator';
import DiscountLabel from '../strings/DiscountLabel';
import DollarsAndCents from '../money/DollarsAndCents';

export default class FinanceDetails extends React.PureComponent {
    static propTypes = {
        pricing: pricingType.isRequired,
    };

    render() {
        const { pricing } = this.props;

        return (
            <div>
                <Group>
                    <Header style={{ fontSize: '1.5em' }}>
                        Finance Details
                    </Header>
                    <Header>Price</Header>
                    <Line>
                        <Label>MSRP</Label>
                        <Value>
                            <DollarsAndCents value={pricing.msrp()} />
                        </Value>
                    </Line>
                    <Line>
                        <Label>
                            <DiscountLabel pricing={pricing} />
                        </Label>
                        <Value isNegative={true}>
                            <DollarsAndCents value={pricing.discount()} />
                        </Value>
                    </Line>
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
                    {pricing.hasRebatesApplied() || (
                        <Line>
                            <Label>No rebates available</Label>
                        </Line>
                    )}
                    {pricing.hasRebatesApplied() && (
                        <Line>
                            <Label>Applied</Label>
                            <Value
                                isNegative={true}
                                isLoading={pricing.quoteIsLoading()}
                            >
                                <DollarsAndCents value={pricing.rebate()} />
                            </Value>
                        </Line>
                    )}
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
                                <Value isNegative={true}>
                                    <DollarsAndCents
                                        value={pricing.downPayment()}
                                    />
                                </Value>
                            </Line>
                            <Line>
                                <Label>Amount Financed</Label>
                                <Value>
                                    <DollarsAndCents
                                        value={pricing.amountFinanced()}
                                    />
                                    *
                                </Value>
                            </Line>
                        </div>
                    )}
                </Group>
            </div>
        );
    }
}
