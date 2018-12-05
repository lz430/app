import React from 'react';
import DollarsAndCents from '../../../../components/money/DollarsAndCents';
import { pricingType } from '../../../../core/types';
import PropTypes from 'prop-types';
import Loading from '../../../../components/Loading';

export default class PaymentCash extends React.PureComponent {
    static propTypes = {
        isDealQuoteRefreshing: PropTypes.bool.isRequired,
        pricing: pricingType.isRequired,
    };

    render() {
        const { pricing } = this.props;

        return (
            <div className="cart__payment-summary text-center mb-4 mt-4">
                <div>Your Cash Price</div>
                <h3 className="font-weight-bold m-0">
                    <DollarsAndCents value={pricing.yourPrice()} />
                </h3>
                {this.props.isDealQuoteRefreshing && <Loading size={2} />}
            </div>
        );
    }
}
