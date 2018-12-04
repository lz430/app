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

export default class MSRPAndDiscount extends React.PureComponent {
    static propTypes = {
        onDiscountChange: PropTypes.func.isRequired,
        onChange: PropTypes.func.isRequired,
        pricing: pricingType.isRequired,
    };

    render() {
        const { pricing, onDiscountChange } = this.props;

        return (
            <div>
                <Group style={{}}>
                    <Line>
                        <Label style={{ margin: 0 }}>MSRP</Label>
                        <Value>
                            <DollarsAndCents value={pricing.msrp()} />
                        </Value>
                    </Line>
                    <Line>
                        <Label style={{ margin: 0 }}>Discounts & Rebates</Label>
                        <Value isNegative={true}>
                            <DollarsAndCents
                                value={pricing.discountsAndRebatesValue()}
                            />
                        </Value>
                    </Line>
                    <Line style={{ marginBottom: '1rem' }}>
                        <Label style={{ margin: 0 }}>Your Price</Label>
                        <Value isLoading={pricing.quoteIsLoading()}>
                            <DollarsAndCents
                                value={pricing.discountedAndRebatedPrice()}
                            />
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
