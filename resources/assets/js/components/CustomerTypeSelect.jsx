import React from 'react';
import { connect } from 'react-redux';
import * as Actions from 'actions/index';
import SVGInline from 'react-svg-inline';
import zondicons from 'zondicons';

class CustomerTypeSelect extends React.PureComponent {
    handleChange(e) {
        this.props.setIsEmployee(e.target.value === 'employee');
    }

    render() {
        return (
            <div className="customer-type">
                <select
                    className="customer-type__select"
                    value={this.props.isEmployee ? 'employee' : 'supplier'}
                    onChange={e => this.handleChange(e)}
                >
                    <option value="employee">Employee/Retiree</option>
                    <option value="supplier">Supplier</option>
                </select>
                <a
                    className="customer-type__info"
                    data-title="If you are eligible for special pricing, please select. Proof of eligibility will be required by dealer.">
                    <SVGInline width="15px" fill="grey" svg={zondicons['information-outline']} />
                </a>
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        isEmployee: state.isEmployee,
    };
};

export default connect(mapStateToProps, Actions)(CustomerTypeSelect);
