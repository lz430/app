import React from 'react';
import { pricingType } from '../../../core/types';
import Group from '../../pricing/components/Group';
import Header from '../../pricing/components/Header';
import Line from '../../pricing/components/Line';
import Label from '../../pricing/components/Label';
import Value from '../../pricing/components/Value';
import Separator from '../../pricing/components/Separator';
import DiscountLabel from '../../../components/strings/DiscountLabel';
import DollarsAndCents from '../../../components/money/DollarsAndCents';

export default class LeaseDetails extends React.PureComponent {
    static propTypes = {
        pricing: pricingType.isRequired,
    };

    render() {
        const { pricing } = this.props;

        return (
            <div>
                <Group>
                    <Header style={{ fontSize: '1.5em' }}>Lease Details</Header>
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
                                <DollarsAndCents value={pricing.rebates()} />
                            </Value>
                        </Line>
                    )}
                </Group>
                <Separator />
                <Group>
                    <Header>Due at Delivery</Header>
                    <Line>
                        <Label>First Payment</Label>
                        <Value>
                            <DollarsAndCents value={pricing.firstPayment()} />
                        </Value>
                    </Line>
                    <Line>
                        <Label>Doc Fee</Label>
                        <Value>
                            <DollarsAndCents
                                value={pricing.docFeeWithTaxes()}
                            />
                        </Value>
                    </Line>
                    <Line>
                        <Label>Electronic Filing Fee</Label>
                        <Value>
                            <DollarsAndCents
                                value={pricing.cvrFeeWithTaxes()}
                            />
                        </Value>
                    </Line>
                    <Line>
                        <Label>Tax on Rebates</Label>
                        <Value>
                            <DollarsAndCents value={pricing.taxOnRebates()} />
                        </Value>
                    </Line>
                    <Line isSectionTotal={true} isImportant={true}>
                        <Label>Total Due</Label>
                        <Value>
                            <DollarsAndCents
                                value={pricing.totalAmountAtDriveOff()}
                            />
                        </Value>
                    </Line>
                </Group>
            </div>
        );
    }
}
