import React from 'react';
import Line from '../../../../apps/pricing/components/Line';
import Label from '../../../../apps/pricing/components/Label';
import Value from '../../../../apps/pricing/components/Value';
import Group from '../../../../apps/pricing/components/Group';
import Separator from '../../../../apps/pricing/components/Separator';
import DollarsAndCents from '../../../../components/money/DollarsAndCents';
import { pricingType } from '../../../../core/types';

export default class CashPane extends React.PureComponent {
    static propTypes = {
        pricing: pricingType.isRequired,
    };

    render() {
        const { pricing } = this.props;

        return (
            <div className="text-center mb-4 mt-4">
                <div>Your Cash Price</div>
                <h3 className="font-weight-bold m-0">
                    <DollarsAndCents value={pricing.yourPrice()} />
                </h3>
                <div>Taxes and fees included</div>
            </div>
        );
    }
}
