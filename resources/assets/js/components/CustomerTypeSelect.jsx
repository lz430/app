import React from 'react';
import R from 'ramda';
import util from 'src/util';
import fuelapi from 'src/fuelapi';
import DealPrice from 'components/DealPrice';
import { connect } from 'react-redux';
import * as Actions from 'actions/index';

class CustomerTypeSelect extends React.PureComponent {
    handleChange(e) {
        this.props.setIsEmployee(e.target.value === 'employee');
    }

    render() {
        return (
            <div>
                <select
                    value={this.props.isEmployee ? 'employee' : 'supplier'}
                    onChange={e => this.handleChange(e)}
                >
                    <option value="employee">Employee/Retiree</option>
                    <option value="supplier">Supplier</option>
                </select>
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
