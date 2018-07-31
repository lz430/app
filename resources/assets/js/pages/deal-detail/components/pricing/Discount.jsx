import React from 'react';
import PropTypes from 'prop-types';

import config from 'config';

import Line from 'components/pricing/Line';
import Label from 'components/pricing/Label';
import Value from 'components/pricing/Value';

export default class Discount extends React.PureComponent {
    static propTypes = {
        dealPricing: PropTypes.object,
        onChange: PropTypes.func.isRequired,
    };

    static defaultProps = {
        onChange: (deal, newValue) => {},
    };

    handleChange = e => {
        this.props.onChange(e.target.value, this.props.dealPricing.make());
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
        const { dealPricing } = this.props;

        return (
            <div>
                <Line>
                    <Label>Discount</Label>
                </Line>
                <Line style={{ margin: '.125em 0 .125em .25em' }}>
                    <div className="form-check">
                        <Label
                            className="form-check-input"
                            style={{ fontSize: '.9em' }}
                        >
                            <input
                                name="discountType"
                                value="dmr"
                                type="radio"
                                className="form-check-input"
                                checked={dealPricing.isEffectiveDiscountDmr()}
                                onChange={e => this.handleChange(e)}
                            />
                            DMR Customer
                        </Label>
                        <Value
                            isNegative={true}
                            showIf={dealPricing.isEffectiveDiscountDmr()}
                        >
                            {dealPricing.dmrDiscount()}
                        </Value>
                    </div>
                </Line>
                {(config.EMPLOYEE_PRICING_WHITELIST_BRANDS.includes(
                    dealPricing.deal().make
                ) ||
                    config.SUPPLIER_PRICING_WHITELIST_BRANDS.includes(
                        dealPricing.deal().make
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
                            dealPricing.deal().make
                        ) && (
                            <Line style={{ margin: '.125em 0 .125em .25em' }}>
                                <div className="form-check">
                                    <Label
                                        className="form-check-input"
                                        style={{ fontSize: '.9em' }}
                                    >
                                        <input
                                            name="discountType"
                                            value="employee"
                                            type="radio"
                                            className="form-check-input"
                                            checked={dealPricing.isEffectiveDiscountEmployee()}
                                            onChange={e => this.handleChange(e)}
                                        />
                                        Employee / Retiree
                                    </Label>
                                    <Value
                                        isNegative={true}
                                        showIf={dealPricing.isEffectiveDiscountEmployee()}
                                    >
                                        {dealPricing.employeeDiscount()}
                                    </Value>
                                </div>

                                {dealPricing.isEffectiveDiscountEmployee() &&
                                    this.renderProofOfEligibility()}
                            </Line>
                        )}
                        {config.SUPPLIER_PRICING_WHITELIST_BRANDS.includes(
                            dealPricing.deal().make
                        ) && (
                            <Line style={{ margin: '.125em 0 .125em .25em' }}>
                                <div className="form-check">
                                    <Label
                                        className="form-check-input"
                                        style={{ fontSize: '.9em' }}
                                    >
                                        <input
                                            name="discountType"
                                            value="supplier"
                                            type="radio"
                                            className="form-check-input"
                                            checked={dealPricing.isEffectiveDiscountSupplier()}
                                            onChange={e => this.handleChange(e)}
                                        />
                                        Supplier / Friends &amp; Family
                                    </Label>
                                    <Value
                                        isNegative={true}
                                        showIf={dealPricing.isEffectiveDiscountSupplier()}
                                    >
                                        {dealPricing.supplierDiscount()}
                                    </Value>
                                </div>

                                {dealPricing.isEffectiveDiscountSupplier() &&
                                    this.renderProofOfEligibility()}
                            </Line>
                        )}
                    </div>
                )}
            </div>
        );
    }
}
