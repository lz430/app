import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faDotCircle,
    faCircle,
    faInfoCircle,
} from '@fortawesome/pro-light-svg-icons';
import { Popover, PopoverBody } from 'reactstrap';

import config from '../../../../core/config';

export default class Discount extends React.PureComponent {
    static propTypes = {
        pricing: PropTypes.object.isRequired,
        onChange: PropTypes.func.isRequired,
    };

    state = {
        employeeDescriptionOpen: false,
        supplierDescriptionOpen: false,
    };

    toggleEmployeeDescription() {
        this.setState({
            employeeDescriptionOpen: !this.state.employeeDescriptionOpen,
        });
    }

    toggleSupplierDescription() {
        this.setState({
            supplierDescriptionOpen: !this.state.supplierDescriptionOpen,
        });
    }

    renderEmployeeDescription() {
        return (
            <Popover
                placement="left"
                isOpen={this.state.employeeDescriptionOpen}
                target="employee-explain"
                toggle={this.toggleEmployeeDescription.bind(this)}
            >
                <PopoverBody>
                    Existing employees or retirees and immediate family members;
                    i.e. son, daughter, mother, father, sister, brother,
                    in-laws. Cousins, grandchildren are not eligible.
                </PopoverBody>
            </Popover>
        );
    }

    renderSupplierDescription() {
        return (
            <Popover
                placement="left"
                isOpen={this.state.supplierDescriptionOpen}
                target="supplier-explain"
                toggle={this.toggleSupplierDescription.bind(this)}
            >
                <PopoverBody>
                    Friends and family of existing employees, or employees of
                    specific supplier companies.
                </PopoverBody>
            </Popover>
        );
    }

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

        let checked, label, infoIcon, infoDescription;

        if (role === 'employee') {
            label = 'Employee Price';
            checked = pricing.isEffectiveDiscountEmployee();
            infoIcon = (
                <FontAwesomeIcon
                    icon={faInfoCircle}
                    className="cursor-pointer"
                    id="employee-explain"
                    onClick={this.toggleEmployeeDescription.bind(this)}
                />
            );
            infoDescription = this.renderEmployeeDescription();
        } else if (role === 'supplier') {
            label = 'Supplier / Friends & Family Price';
            checked = pricing.isEffectiveDiscountSupplier();
            infoIcon = (
                <FontAwesomeIcon
                    icon={faInfoCircle}
                    className="cursor-pointer"
                    id="supplier-explain"
                    onClick={this.toggleSupplierDescription.bind(this)}
                />
            );
            infoDescription = this.renderSupplierDescription();
        }

        return (
            <div
                className={classNames(
                    'd-flex',
                    'cart__discount_role',
                    { 'border-primary': checked },
                    { 'font-weight-bold': checked },
                    { 'border-default': !checked }
                )}
            >
                <div
                    className="d-flex align-items-center justify-content-center"
                    onClick={() => this.handleChange(role, pricing.make())}
                >
                    <FontAwesomeIcon icon={checked ? faDotCircle : faCircle} />
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
                <div className="ml-auto">
                    {infoIcon}
                    {infoDescription}
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
                    Employee / Retiree Pricing
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
