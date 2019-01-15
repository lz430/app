import React from 'react';

import Line from '../../../../apps/pricing/components/Line';
import Label from '../../../../apps/pricing/components/Label';
import Value from '../../../../apps/pricing/components/Value';
import Group from '../../../../apps/pricing/components/Group';
import Header from '../../../../apps/pricing/components/Header';
import DollarsAndCents from '../../../../components/money/DollarsAndCents';
import { pricingType } from '../../../../core/types';

/**
 * Used for cash and finance
 */
export default class DetailsTaxesAndFees extends React.PureComponent {
    static propTypes = {
        pricing: pricingType.isRequired,
    };

    render() {
        const { pricing } = this.props;

        return (
            <Group>
                <Header>Taxes &amp; Fees</Header>
                <Line>
                    <Label>Doc Fee</Label>
                    <Value>
                        <DollarsAndCents value={pricing.docFeeWithTaxes()} />
                    </Value>
                </Line>
                <Line>
                    <Label>Electronic Filing Fee</Label>
                    <Value>
                        <DollarsAndCents value={pricing.cvrFeeWithTaxes()} />
                    </Value>
                </Line>
                <Line>
                    <Label>Sales Tax</Label>
                    <Value>
                        <DollarsAndCents value={pricing.salesTax()} />
                    </Value>
                </Line>
                <Line isImportant>
                    <Label>Total Taxes & Fees</Label>
                    <Value>
                        <DollarsAndCents value={pricing.taxesAndFees()} />
                    </Value>
                </Line>
            </Group>
        );
    }
}
