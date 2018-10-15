import React from 'react';
import PropTypes from 'prop-types';

import config from '../../../../config';

import Line from '../../../../components/pricing/Line';
import Label from '../../../../components/pricing/Label';
import Value from '../../../../components/pricing/Value';
import DollarsAndCents from '../../../../components/money/DollarsAndCents';

export default class Discount extends React.PureComponent {
    static propTypes = {
        pricing: PropTypes.object.isRequired,
        onChange: PropTypes.func.isRequired,
    };

    handleChange = e => {
        this.props.onChange(e.target.value, this.props.pricing.make());
    };

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

    render() {
        const { pricing } = this.props;

        return (
            <div>
                <Line>
                    <Label>Discount</Label>
                </Line>
                <Line className="">
                    <div className="form-check">
                        <Label className="form-check-input" for="dmr">
                            <input
                                name="discountType"
                                value="dmr"
                                type="radio"
                                className="form-check-input"
                                checked={pricing.isEffectiveDiscountDmr()}
                                onChange={e => this.handleChange(e)}
                                id={'dmr'}
                            />
                            DMR Customer
                        </Label>
                        <div className="savings">
                            <Value
                                isNegative={true}
                                showIf={pricing.isEffectiveDiscountDmr()}
                            >
                                <DollarsAndCents
                                    value={pricing.dmrDiscount()}
                                />
                            </Value>
                        </div>
                    </div>
                </Line>
                {(config.EMPLOYEE_PRICING_WHITELIST_BRANDS.includes(
                    pricing.make()
                ) ||
                    config.SUPPLIER_PRICING_WHITELIST_BRANDS.includes(
                        pricing.make()
                    )) && (
                    <div>
                        <div
                            style={{
                                fontSize: '.75em',
                                marginLeft: '.25em',
                            }}
                        >
                            Or select from the following:
                        </div>
                        {config.EMPLOYEE_PRICING_WHITELIST_BRANDS.includes(
                            pricing.make()
                        ) && (
                            <Line>
                                <div className="form-check">
                                    <Label
                                        className="form-check-input"
                                        for="employee"
                                    >
                                        <input
                                            name="discountType"
                                            value="employee"
                                            type="radio"
                                            className="form-check-input"
                                            checked={pricing.isEffectiveDiscountEmployee()}
                                            onChange={e => this.handleChange(e)}
                                            id={'employee'}
                                        />
                                        Employee / Retiree
                                    </Label>
                                    <div className="savings">
                                        <Value
                                            isNegative={true}
                                            showIf={pricing.isEffectiveDiscountEmployee()}
                                        >
                                            <DollarsAndCents
                                                value={pricing.employeeDiscount()}
                                            />
                                        </Value>
                                    </div>
                                </div>

                                {pricing.isEffectiveDiscountEmployee() &&
                                    this.renderProofOfEligibility()}
                            </Line>
                        )}
                        {config.SUPPLIER_PRICING_WHITELIST_BRANDS.includes(
                            pricing.make()
                        ) && (
                            <Line>
                                <div className="form-check">
                                    <Label
                                        className="form-check-input"
                                        for="supplier"
                                    >
                                        <input
                                            name="discountType"
                                            value="supplier"
                                            type="radio"
                                            className="form-check-input"
                                            checked={pricing.isEffectiveDiscountSupplier()}
                                            onChange={e => this.handleChange(e)}
                                            id="supplier"
                                        />
                                        Supplier / Friends &amp; Family
                                    </Label>
                                    <div className="savings">
                                        <Value
                                            isNegative={true}
                                            showIf={pricing.isEffectiveDiscountSupplier()}
                                        >
                                            <DollarsAndCents
                                                value={pricing.supplierDiscount()}
                                            />
                                        </Value>
                                    </div>
                                </div>

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
