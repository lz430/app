import React from 'react';
import { pricingType } from 'types';

export default class DiscountLabel extends React.PureComponent {
    static propTypes = {
        pricing: pricingType.isRequired,
    };

    render() {
        const { pricing } = this.props;

        return (
            <span>
                {pricing.isEffectiveDiscountDmr() && 'DMR Customer Discount'}
                {pricing.isEffectiveDiscountSupplier() && 'Supplier Discount'}
                {pricing.isEffectiveDiscountEmployee() && 'Employee Discount'}
            </span>
        );
    }
}
