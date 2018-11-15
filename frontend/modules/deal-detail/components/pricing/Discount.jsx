import React from 'react';
import PropTypes from 'prop-types';

import config from '../../../../core/config';

import Line from '../../../../apps/pricing/components/Line';
import DollarsAndCents from '../../../../components/money/DollarsAndCents';
import classNames from 'classnames';

export default class Discount extends React.PureComponent {
    static propTypes = {
        pricing: PropTypes.object.isRequired,
        onChange: PropTypes.func.isRequired,
    };

    handleChange(role, make) {
        this.props.onChange(role, make);
    }

    renderProofOfEligibility = () => {
        return (
            <div
                style={{
                    fontStyle: 'italic',
                    fontSize: '.75em',
                    marginLeft: '.25em',
                }}
            >
                Proof of eligibility required.
            </div>
        );
    };

    renderPrimaryRole(role) {
        const { pricing } = this.props;

        let checked, discount, label, price;

        if (role === 'employee') {
            label = 'Employee Price';
            checked = pricing.isEffectiveDiscountEmployee();
            discount = pricing.employeeDiscount();
            price = pricing.employeePrice();
        } else if (role === 'supplier') {
            label = 'Supplier / Friends & Family Price';
            checked = pricing.isEffectiveDiscountSupplier();
            discount = pricing.supplierDiscount();
            price = pricing.supplierPrice();
        } else {
            label = 'Deliver My Ride Customer Price';
            checked = pricing.isEffectiveDiscountDmr();
            discount = pricing.dmrDiscount();
            price = pricing.defaultPrice();
        }

        return (
            <div
                onClick={() => this.handleChange(role, pricing.make())}
                className={classNames(
                    'cart__discount_role',
                    'text-center',
                    'bg-light',
                    'p-2',
                    'mb-2',
                    'border',
                    { 'border-primary': checked },
                    { 'border-default': !checked }
                )}
            >
                <div
                    className={classNames('cart__discount_role_label', {
                        'font-weight-bold': checked,
                    })}
                >
                    {label}
                </div>
                {checked && (
                    <div className="cart__discount_role_price text-sm">
                        <DollarsAndCents value={price} />
                    </div>
                )}
                {checked && (
                    <div className="cart__discount_role_savings text-sm">
                        Savings: -<DollarsAndCents value={discount} />
                    </div>
                )}
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

        return (
            <div>
                <Line>{this.renderPrimaryRole('dmr')}</Line>
                {(shouldRenderEmployeePricing ||
                    shouldRenderSupplierPricing) && (
                    <div>
                        <div
                            style={{
                                fontSize: '.75em',
                                marginLeft: '.25em',
                            }}
                        >
                            Or select from the following:
                        </div>
                        {shouldRenderEmployeePricing && (
                            <Line>
                                {this.renderPrimaryRole('employee')}
                                {pricing.isEffectiveDiscountEmployee() &&
                                    this.renderProofOfEligibility()}
                            </Line>
                        )}
                        {shouldRenderSupplierPricing && (
                            <Line>
                                {this.renderPrimaryRole('supplier')}
                                {pricing.isEffectiveDiscountSupplier() &&
                                    this.renderProofOfEligibility()}
                            </Line>
                        )}
                    </div>
                )}
            </div>
        );
    }
}
