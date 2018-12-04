import React from 'react';
import { pricingType } from '../../../../core/types';

import Line from '../../../../apps/pricing/components/Line';
import Label from '../../../../apps/pricing/components/Label';
import Value from '../../../../apps/pricing/components/Value';
import Group from '../../../../apps/pricing/components/Group';
import Header from '../../../../apps/pricing/components/Header';
import DollarsAndCents from '../../../../components/money/DollarsAndCents';

export default class DetailsLeaseDueAtDeliveryFees extends React.PureComponent {
    static propTypes = {
        pricing: pricingType.isRequired,
    };

    state = {
        paymentPopoverOpen: false,
        duePopoverOpen: false,
    };

    render() {
        const { pricing } = this.props;

        return (
            <div>
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
                    <Line>
                        <Label>Down Payment</Label>
                        <Value>
                            <DollarsAndCents value={pricing.cashDownCCR()} />
                        </Value>
                    </Line>
                    <Line isSectionTotal={true} isImportant={true}>
                        <Label>Total Due</Label>
                        <Value>
                            <DollarsAndCents
                                value={pricing.totalAmountAtDriveOff()}
                            />
                            *
                        </Value>
                    </Line>
                </Group>
            </div>
        );
    }
}
