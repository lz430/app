import React from 'react';
import util from 'src/util';
import R from 'ramda';
import Rebates from 'components/Rebates';
import CustomerTypeSelect from 'components/CustomerTypeSelect';
import rebates from 'src/rebates';
import { connect } from 'react-redux';
import * as Actions from 'actions';
import formulas from 'src/formulas';

class CashCalculator extends React.PureComponent {
    render() {
        return (
            <div>
                Cash Price{' '}
                {util.moneyFormat(
                    util.getEmployeeOrSupplierPrice(
                        this.props.deal,
                        this.props.isEmployee
                    )
                )}
                <CustomerTypeSelect />
                <hr />
                Available Rebates and Incentives
                <Rebates />
                <hr />
                Summary
                <div>
                    <div>
                        <span>MSRP</span>
                        <span style={{ float: 'right' }}>
                            {util.moneyFormat(this.props.deal.msrp)}
                        </span>
                    </div>
                    <div>
                        <span>Your Price</span>
                        <span style={{ float: 'right' }}>
                            {util.moneyFormat(
                                util.getEmployeeOrSupplierPrice(
                                    this.props.deal,
                                    this.props.isEmployee
                                )
                            )}
                        </span>
                    </div>
                    <div>
                        <span>Documentation Fee</span>
                        <span style={{ float: 'right' }}>
                            {util.moneyFormat(this.props.deal.doc_fee)}
                        </span>
                    </div>
                    <div>
                        <span>Sales Tax</span>
                        <span style={{ float: 'right' }}>
                            {util.moneyFormat(
                                formulas.calculateSalesTaxCashFinance(
                                    util.getEmployeeOrSupplierPrice(
                                        this.props.deal,
                                        this.props.isEmployee
                                    ),
                                    this.props.deal.doc_fee
                                )
                            )}
                        </span>
                    </div>
                    <div>
                        <span>Your Rebates and Incentives</span>
                        <span style={{ float: 'right' }}>
                            {util.moneyFormat(
                                R.sum(
                                    R.map(
                                        R.prop('value'),
                                        this.props.selectedRebates
                                    )
                                )
                            )}
                        </span>
                    </div>
                    <div>
                        <span>Total Cost of Vehicle</span>
                        <span style={{ float: 'right', color: 'green' }}>
                            {util.moneyFormat(
                                formulas.calculateTotalCashFinance(
                                    util.getEmployeeOrSupplierPrice(
                                        this.props.deal,
                                        this.props.isEmployee
                                    ),
                                    this.props.deal.doc_fee,
                                    this.props.downPayment,
                                    R.sum(
                                        R.map(
                                            R.prop('value'),
                                            this.props.selectedRebates
                                        )
                                    )
                                )
                            )}
                        </span>
                    </div>
                </div>
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        deal: state.selectedDeal,
        downPayment: state.downPayment,
        isEmployee: state.isEmployee,
        selectedRebates: rebates.getSelectedRebatesForDealAndType(
            state.dealRebates,
            state.selectedRebates,
            state.selectedTab,
            state.selectedDeal
        ),
    };
}

export default connect(mapStateToProps, Actions)(CashCalculator);
