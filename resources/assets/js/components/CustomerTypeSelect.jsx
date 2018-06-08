import React from 'react';
import SVGInline from 'react-svg-inline';
import zondicons from 'zondicons';

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
];

class CustomerTypeSelect extends React.PureComponent {
    handleChange(e) {
        this.props.setEmployeeBrand(
            e.target.value === 'employee' ? this.props.deal.make : false
        );
        this.props.onChange(this.props.deal, e.target.value);
    }

    render() {
        return domesticBrands.includes(this.props.deal.make) ? (
            <div className="customer-type">
                <select
                    className="customer-type__select"
                    value={
                        this.props.employeeBrand === this.props.deal.make
                            ? 'employee'
                            : 'supplier'
                    }
                    onChange={e => this.handleChange(e)}
                >
                    <option value="employee">Employee/Retiree</option>
                    <option value="supplier">Supplier</option>
                </select>
                <a
                    className="customer-type__info"
                    data-title="If you are eligible for special pricing, please select. Proof of eligibility will be required by dealer."
                >
                    <SVGInline
                        width="15px"
                        fill="grey"
                        svg={zondicons['information-outline']}
                    />
                </a>
            </div>
        ) : (
            <div />
        );
    }
}

CustomerTypeSelect.defaultProps = {
    onChange: (deal, newValue) => {},
};

export default CustomerTypeSelect;
