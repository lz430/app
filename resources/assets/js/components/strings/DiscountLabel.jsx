import React from 'react';
import { dealPricingType } from '../../types';

export default class DiscountLabel extends React.PureComponent {
    static propTypes = {
        dealPricing: dealPricingType.isRequired,
    };

    render() {
        const { dealPricing } = this.props;

        return (
            <span>
                {dealPricing.isEffectiveDiscountDmr() &&
                    'DMR Customer Discount'}
                {dealPricing.isEffectiveDiscountSupplier() &&
                    'Supplier Discount'}
                {dealPricing.isEffectiveDiscountEmployee() &&
                    'Employee Discount'}
            </span>
        );
    }
}
