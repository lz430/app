import React from 'react';
import DollarsAndCents from '../../../../components/money/DollarsAndCents';
import { pricingType } from '../../../../core/types';

export default class PaymentCash extends React.PureComponent {
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
            </div>
        );
    }
}
