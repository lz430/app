import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import { faDotCircle, faCircle } from '@fortawesome/pro-light-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import config from '../../../../core/config';
import Line from '../../../../apps/pricing/components/Line';

export default class Discount extends React.PureComponent {
    static propTypes = {
        pricing: PropTypes.object.isRequired,
        onChange: PropTypes.func.isRequired,
    };

    handleChange(role, make) {
        if (role === this.props.pricing.discountType() && role !== 'dmr') {
            this.props.onChange('dmr', make);
        } else if (role !== this.props.pricing.discountType()) {
            this.props.onChange(role, make);
        }
    }

    renderProofOfEligibility() {
        return (
            <div className="text-sm text-center border-top border-medium p-1 text-danger font-weight-bold bg-light">
                Proof of eligibility required.
            </div>
        );
    }

    renderPrimaryRole(role) {
        const { pricing } = this.props;

        let checked, label;

        if (role === 'employee') {
            label = 'Employee Price';
            checked = pricing.isEffectiveDiscountEmployee();
        } else if (role === 'supplier') {
            label = 'Supplier / Friends & Family Price';
            checked = pricing.isEffectiveDiscountSupplier();
        }

        return (
            <div
                onClick={() => this.handleChange(role, pricing.make())}
                className={classNames(
                    'cart__discount_role',
                    'd-flex',
                    { 'border-primary': checked },
                    { 'font-weight-bold': checked },
                    { 'border-default': !checked }
                )}
            >
                <div>
                    <FontAwesomeIcon icon={checked ? faDotCircle : faCircle} />
                </div>
                <div
                    className={classNames(
                        'w-100',
                        'text-sm',
                        'pl-2',
                        'cart__discount_role_label'
                    )}
                >
                    {label}
                </div>
            </div>
        );
    }

    render() {
        const { pricing } = this.props;
        const shouldRenderEmployeePricing = config.EMPLOYEE_PRICING_WHITELIST_BRANDS.includes(
            pricing.make()
        );
        const shouldRenderSupplierPricing = config.SUPPLIER_PRICING_WHITELIST_BRANDS.includes(
            pricing.make()
        );

        if (!shouldRenderSupplierPricing && !shouldRenderEmployeePricing) {
            return false;
        }

        const shouldRenderProof = !!(
            pricing.isEffectiveDiscountSupplier() ||
            pricing.isEffectiveDiscountEmployee()
        );

        return (
            <div className="border border-medium">
                <div className="border-bottom border-medium pl-2 pr-2 pt-1 pb-1">
                    Employee Pricing
                </div>
                <div className="p-2">
                    {shouldRenderEmployeePricing && (
                        <div className="mb-2">
                            {this.renderPrimaryRole('employee')}
                        </div>
                    )}
                    {shouldRenderSupplierPricing && (
                        <div>{this.renderPrimaryRole('supplier')}</div>
                    )}
                </div>
                {shouldRenderProof && this.renderProofOfEligibility()}
            </div>
        );
    }
}
