import React from 'react';
import Line from 'components/pricing/Line';
import Label from 'components/pricing/Label';
import Value from 'components/pricing/Value';

const domesticBrands = [
    'Chrysler',
    'Dodge',
    'Jeep',
    'Ford',
    'Lincoln',
    'Chevrolet',
    'Cadillac',
    'Buick',
    'GMC',
    'Ram',
    // TODO: Fiat has employee pricing but no supplier, fix this logic so that we can support this usecase.
    // 'Fiat'
];

export default class Discount extends React.PureComponent {
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
        const { dealPricing, ...other } = this.props;

        return (
            <div>
                <Line>
                    <Label>Discount</Label>
                </Line>
                <Line style={{ margin: '.125em 0 .125em .25em' }}>
                    <Label style={{ fontSize: '.9em' }}>
                        <input
                            name="discountType"
                            value="dmr"
                            type="radio"
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
                </Line>
                {domesticBrands.includes(dealPricing.deal().make) && (
                    <div>
                        <div
                            style={{
                                fontSize: '.75em',
                                marginLeft: '.25em',
                            }}
                        >
                            Or select from the following:
                        </div>

                        <Line style={{ margin: '.125em 0 .125em .25em' }}>
                            <Label style={{ fontSize: '.9em' }}>
                                <input
                                    name="discountType"
                                    value="employee"
                                    type="radio"
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
                            {dealPricing.isEffectiveDiscountEmployee() &&
                                this.renderProofOfEligibility()}
                        </Line>
                        <Line style={{ margin: '.125em 0 .125em .25em' }}>
                            <Label style={{ fontSize: '.9em' }}>
                                <input
                                    name="discountType"
                                    value="supplier"
                                    type="radio"
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
                            {dealPricing.isEffectiveDiscountSupplier() &&
                                this.renderProofOfEligibility()}
                        </Line>
                    </div>
                )}
            </div>
        );
    }
}
