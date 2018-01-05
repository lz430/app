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
                        this.props.employeeBrand
                    )
                )}
                <CustomerTypeSelect deal={this.props.deal} />
                <hr />
                <h4>Some text here about picking yoour target</h4>
                <Rebates />
                <hr />
                <h4>Summary</h4>
                <div>
                    <div>
                        <span className="cash-finance-lease-calculator__left-item">
                            MSRP
                        </span>
                        <span className="cash-finance-lease-calculator__right-item">
                            {util.moneyFormat(this.props.deal.msrp)}
                        </span>
                    </div>
                    <div>
                        <span className="cash-finance-lease-calculator__left-item">
                            Your Price
                        </span>
                        <span className="cash-finance-lease-calculator__right-item">
                            {util.moneyFormat(
                                util.getEmployeeOrSupplierPrice(
                                    this.props.deal,
                                    this.props.employeeBrand
                                )
                            )}
                        </span>
                    </div>
                    <div>
                        <span className="cash-finance-lease-calculator__left-item">
                            Documentation Fee
                        </span>
                        <span className="cash-finance-lease-calculator__right-item">
                            {util.moneyFormat(this.props.deal.doc_fee)}
                        </span>
                    </div>
                    <div>
                        <span className="cash-finance-lease-calculator__left-item">
                            Sales Tax
                        </span>
                        <span className="cash-finance-lease-calculator__right-item">
                            {util.moneyFormat(
                                formulas.calculateSalesTaxCashFinance(
                                    util.getEmployeeOrSupplierPrice(
                                        this.props.deal,
                                        this.props.employeeBrand
                                    ),
                                    this.props.deal.doc_fee
                                )
                            )}
                        </span>
                    </div>
                    <div>
                        <span className="cash-finance-lease-calculator__left-item">
                            Some text here about yoour targets
                        </span>
                        <span className="cash-finance-lease-calculator__right-item">
                            {util.moneyFormat(
                                R.sum(
                                    [0]
                                    /* @todo fix to pull this info from the api or whatever
                                    R.map(
                                        R.prop('value'),
                                        this.props.selectedTargets
                                    )
                                    */
                                )
                            )}
                        </span>
                    </div>
                    <div>
                        <span className="cash-finance-lease-calculator__left-item">
                            Total Cost of Vehicle
                        </span>
                        <span className="cash-finance-lease-calculator__right-item">
                            {util.moneyFormat(
                                formulas.calculateTotalCashFinance(
                                    util.getEmployeeOrSupplierPrice(
                                        this.props.deal,
                                        this.props.employeeBrand
                                    ),
                                    this.props.deal.doc_fee,
                                    this.props.downPayment,
                                    R.sum(
                                        R.map(
                                            R.prop('value'),
                                            this.props.selectedTargets
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
        employeeBrand: state.employeeBrand,
        selectedTargets: rebates.getSelectedTargetsForDeal(
            state.dealRebates,
            state.selectedTargets,
            state.selectedTab,
            state.selectedDeal
        ),
    };
}

export default connect(mapStateToProps, Actions)(CashCalculator);
