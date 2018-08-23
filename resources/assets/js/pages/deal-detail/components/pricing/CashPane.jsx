import React from 'react';
import Discount from './Discount';
import Rebates from './Rebates';
import Line from '../../../../components/pricing/Line';
import Label from '../../../../components/pricing/Label';
import Value from '../../../../components/pricing/Value';
import Group from '../../../../components/pricing/Group';
import Header from '../../../../components/pricing/Header';
import Separator from '../../../../components/pricing/Separator';
import DollarsAndCents from '../../../../components/money/DollarsAndCents';
import Loading from '../../../../icons/miscicons/Loading';
import { pricingType } from '../../../../types';

export default class CashPane extends React.PureComponent {
    static propTypes = {
        pricing: pricingType.isRequired,
    };

    static defaultProps = {
        onDiscountChange: (discountType, make = null) => {},
        onRebatesChange: () => {},
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
                    {pricing.quoteIsLoading() && <Loading />}
                    {pricing.quoteIsLoaded() && (
                        <Rebates pricing={pricing} onChange={onRebatesChange} />
                    )}
                    <Line isImportant={true} isSectionTotal={true}>
                        <Label>Total Selling Price</Label>
                        <Value isLoading={pricing.quoteIsLoading()}>
                            <DollarsAndCents value={pricing.yourPrice()} />*
                        </Value>
                    </Line>
                </Group>
            </div>
        );
    }
}
