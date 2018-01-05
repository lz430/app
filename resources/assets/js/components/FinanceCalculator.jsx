import React from 'react';
import util from 'src/util';
import R from 'ramda';
import Rebates from 'components/Rebates';
import CustomerTypeSelect from 'components/CustomerTypeSelect';
import rebates from 'src/rebates';
import formulas from 'src/formulas';
import { connect } from 'react-redux';
import * as Actions from 'actions';
import SVGInline from 'react-svg-inline';
import miscicons from 'miscicons';

class FinanceCalculator extends React.PureComponent {
    constructor(props) {
        super(props);
    }

    updateDownPayment(e) {
        this.props.updateDownPayment(Math.max(e.target.value, 0));
    }

    updateTermDuration(e) {
        this.props.updateTermDuration(Number(e.target.value));
    }

    getTotalVehicleCost() {
        return this.props.availableTargets
            ? formulas.calculateTotalCashFinance(
                  util.getEmployeeOrSupplierPrice(
                      this.props.deal,
                      this.props.employeeBrand
                  ),
                  this.props.deal.doc_fee,
                  0,
                  9999, // @todo update to pull from api or whatever
                  // R.sum(R.map(R.prop('value'), this.props.selectedTargets))
              )
            : null;
    }

    getAmountToFinance() {
        return this.props.availableTargets
            ? formulas.calculateTotalCashFinance(
                  util.getEmployeeOrSupplierPrice(
                      this.props.deal,
                      this.props.employeeBrand
                  ),
                  this.props.deal.doc_fee,
                  this.props.downPayment,
                  9999 // @todo update to pull from api or whatever
                  // R.sum(R.map(R.prop('value'), this.props.selectedTargets))
              )
            : null;
    }

    renderTotalCostOfVehicle() {
        const totalCostOfVehicle = this.getTotalVehicleCost();

        return (
            <div>
                <span className="cash-finance-lease-calculator__left-item">
                    Total Cost of Vehicle
                </span>
                <span className="cash-finance-lease-calculator__right-item">
                    {totalCostOfVehicle ? (
                        util.moneyFormat(totalCostOfVehicle)
                    ) : (
                        <SVGInline svg={miscicons['loading']} />
                    )}
                </span>
            </div>
        );
    }

    renderYourTargets() {
        return (
            <div>
                <span className="cash-finance-lease-calculator__left-item">
                    Some text here about your target
                </span>
                <span className="cash-finance-lease-calculator__right-item">
                    {this.props.availableTargets ? (
                        util.moneyFormat(
                            R.sum(
                                [9999] // @todo update to pull from api or whatever
                                /*
                                R.map(
                                    R.prop('value'),
                                    this.props.selectedTargets
                                )
                                */
                            )
                        )
                    ) : (
                        <SVGInline svg={miscicons['loading']} />
                    )}
                </span>
            </div>
        );
    }

    renderAmountFinanced() {
        const totalAmountToFinance = this.getAmountToFinance();

        return (
            <div>
                <span className="cash-finance-lease-calculator__left-item">
                    Amount Financed
                </span>
                <span className="cash-finance-lease-calculator__right-item">
                    {totalAmountToFinance ? (
                        util.moneyFormat(totalAmountToFinance)
                    ) : (
                        <SVGInline svg={miscicons['loading']} />
                    )}
                </span>
            </div>
        );
    }

    renderYourMonthlyFinancePayment() {
        const totalVehicleCost = this.getTotalVehicleCost();

        return (
            <div>
                <span className="cash-finance-lease-calculator__left-item">
                    Your Monthly Finance Payment
                </span>
                <span className="cash-finance-lease-calculator__right-item">
                    {totalVehicleCost ? (
                        util.moneyFormat(
                            Math.round(
                                formulas.calculateFinancedMonthlyPayments(
                                    totalVehicleCost,
                                    this.props.downPayment,
                                    this.props.termDuration
                                )
                            )
                        )
                    ) : (
                        <SVGInline svg={miscicons['loading']} />
                    )}
                </span>
            </div>
        );
    }

    render() {
        return (
            <div>
                Finance Price{' '}
                {util.moneyFormat(
                    util.getEmployeeOrSupplierPrice(
                        this.props.deal,
                        this.props.employeeBrand
                    )
                )}
                <CustomerTypeSelect deal={this.props.deal} />
                <hr />
                <h4>Available Rebates and Incentives</h4>
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
                    {this.renderYourTargets()}
                    {this.renderTotalCostOfVehicle()}
                </div>
                <hr />
                <div>
                    <h4>Calculate Your Payment</h4>
                    {this.renderAmountFinanced()}
                    <div>
                        <span className="cash-finance-lease-calculator__left-item">
                            Down Payment (10%)
                        </span>
                        <span className="cash-finance-lease-calculator__right-item">
                            ${' '}
                            <input
                                type="number"
                                min="0"
                                name="down-payment"
                                value={this.props.downPayment}
                                onChange={e => this.updateDownPayment(e)}
                            />
                        </span>
                    </div>
                    <div>
                        <span className="cash-finance-lease-calculator__left-item">
                            Term Duration
                        </span>
                        <span className="cash-finance-lease-calculator__right-item">
                            <select
                                value={this.props.termDuration}
                                onChange={e => this.updateTermDuration(e)}
                            >
                                <option value="60">60</option>
                                <option value="48">48</option>
                                <option value="36">36</option>
                                <option value="24">24</option>
                            </select>
                        </span>
                    </div>
                </div>
                <div>
                    <span className="cash-finance-lease-calculator__left-item">
                        Annual Percentage Rate (* 4% is an estimated APR)
                    </span>
                    <span className="cash-finance-lease-calculator__right-item">
                        4%
                    </span>
                </div>
                {this.renderYourMonthlyFinancePayment()}
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        zipcode: state.zipcode,
        downPayment: state.downPayment,
        deal: state.selectedDeal,
        termDuration: state.termDuration,
        employeeBrand: state.employeeBrand,
        availableTargets: rebates.getAvailableTargetsForDeal(
            state.dealTargets,
            state.selectedDeal
        ),
        selectedTargets: rebates.getSelectedTargetsForDeal(
            state.dealTargets,
            state.selectedTargets,
            state.selectedDeal
        ),
    };
}

export default connect(mapStateToProps, Actions)(FinanceCalculator);
