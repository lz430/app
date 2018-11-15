import React from 'react';
import PropTypes from 'prop-types';
import { pricingType } from '../../../../core/types';

import Line from '../../../../apps/pricing/components/Line';
import Label from '../../../../apps/pricing/components/Label';
import Value from '../../../../apps/pricing/components/Value';
import Group from '../../../../apps/pricing/components/Group';
import DollarsAndCents from '../../../../components/money/DollarsAndCents';
import Discount from './Discount';
import Separator from '../../../../apps/pricing/components/Separator';

export default class MSRPAndDiscountPane extends React.PureComponent {
    static propTypes = {
        onDiscountChange: PropTypes.func.isRequired,
        onRebatesChange: PropTypes.func.isRequired,
        onChange: PropTypes.func.isRequired,
        pricing: pricingType.isRequired,
    };

    state = {
        leaseTermsSelectOpened: false,
    };

    render() {
        const { pricing, onDiscountChange } = this.props;

        return (
            <div>
                <Group style={{}}>
                    <Line>
                        <Label>MSRP</Label>
                        <Value>
                            <DollarsAndCents value={pricing.msrp()} />
                        </Value>
                    </Line>
                    <Separator />
                    <Discount pricing={pricing} onChange={onDiscountChange} />
                </Group>
                <Separator />
            </div>
        );
    }
}
