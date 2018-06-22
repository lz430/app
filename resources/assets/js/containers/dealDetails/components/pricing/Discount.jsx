import React from 'react';
import Line from "./Line";
import Label from "./Label";
import Value from "./Value";

const domesticBrands = ['Chrysler', 'Dodge', 'Jeep', 'Ford', 'Lincoln', 'Chevrolet', 'Cadillac', 'Buick', 'GMC'];

class Discount extends React.PureComponent {
    handleChange(e) {
        this.props.onChange(e.target.value, this.props.dealPricing.make());
    }

    render() {
        const {dealPricing, ...other} = this.props;

        return (
            <div>
                <Line>
                    <Label>Discount</Label>
                    <div style={{fontStyle: 'italic', fontSize: '.75em', marginLeft: '.25em'}}>Proof of eligibility required.</div>
                </Line>
                <Line style={{margin: '.125em 0 .125em .25em'}}>
                    <Label style={{fontSize: '.9em'}}>
                        <input name="discountType" value="dmr" type="radio" checked={dealPricing.isEffectiveDiscountDmr()} onChange={(e) => this.handleChange(e)}/>
                        DMR Customer
                    </Label>
                    <Value isNegative={true} showIf={dealPricing.isEffectiveDiscountDmr()}>{dealPricing.dmrDiscount()}</Value>
                </Line>
                {domesticBrands.includes(dealPricing.deal().make) &&
                <Line style={{margin: '.125em 0 .125em .25em'}}>
                    <Label style={{fontSize: '.9em'}}>
                        <input name="discountType" value="employee" type="radio" checked={dealPricing.isEffectiveDiscountEmployee()} onChange={(e) => this.handleChange(e)}/>
                        Employee / Retiree
                    </Label>
                    <Value isNegative={true} showIf={dealPricing.isEffectiveDiscountEmployee()}>{dealPricing.employeeDiscount()}</Value>
                </Line>
                }
                {domesticBrands.includes(this.props.dealPricing.deal().make) &&
                <Line style={{margin: '.125em 0 .125em .25em'}}>
                    <Label style={{fontSize: '.9em'}}>
                        <input name="discountType" value="supplier" type="radio" checked={dealPricing.isEffectiveDiscountSupplier()} onChange={(e) => this.handleChange(e)}/>
                        Supplier / Friends &amp; Family
                    </Label>
                    <Value isNegative={true} showIf={dealPricing.isEffectiveDiscountSupplier()}>{dealPricing.supplierDiscount()}</Value>
                </Line>
                }
            </div>
        )
    }
}

Discount.defaultProps = {
    onChange: (deal, newValue) => {}
};

export default Discount;
