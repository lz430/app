import React from 'react';
import util from 'src/util';
import R from 'ramda';
import Targets from 'components/Targets';
import CustomerTypeSelect from 'components/CustomerTypeSelect';
import formulas from 'src/formulas';
import { connect } from 'react-redux';
import * as Actions from 'actions';
import SVGInline from 'react-svg-inline';
import miscicons from 'miscicons';

class FinanceCalculator extends React.PureComponent {
    componentWillMount() {
        this.props.requestTargets(this.props.deal);
        this.props.requestBestOffer(this.props.deal);
    }

    componentWillUnmount() {
        this.props.clearBestOffer();
    }

    updateDownPayment(e) {
        this.props.updateDownPayment(Math.max(e.target.value, 0));
    }

    updateTermDuration(e) {
        this.props.updateTermDuration(Number(e.target.value));
    }

    bestOfferTotalValue() {
        return this.props.dealBestOffer.totalValue
            ? this.props.dealBestOffer.totalValue
            : 0;
    }

    getTotalVehicleCost() {
        return this.props.dealBestOffer
            ? formulas.calculateTotalCashFinance(
                  util.getEmployeeOrSupplierPrice(
                      this.props.deal,
                      this.props.employeeBrand
                  ),
                  this.props.deal.doc_fee,
                  0,
                  this.bestOfferTotalValue()
              )
            : null;
    }

    getAmountToFinance() {
        return this.props.dealBestOffer
            ? formulas.calculateTotalCashFinance(
                  util.getEmployeeOrSupplierPrice(
                      this.props.deal,
                      this.props.employeeBrand
                  ),
                  this.props.deal.doc_fee,
                  this.props.downPayment,
                  this.bestOfferTotalValue()
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
        return <div>
                <span className="cash-finance-lease-calculator__left-item">
                    Rebates Applied
                </span>
                <span className="cash-finance-lease-calculator__right-item">
                    {this.props.dealBestOffer ? (
                        util.moneyFormat(this.bestOfferTotalValue())
                    ) : (
                        <SVGInline svg={miscicons['loading']} />
                    )}
                </span>
            </div>;
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
                <Targets
                    deal={this.props.deal}
                    targetsChanged={this.props.requestBestOffer.bind(
                        this,
                        this.props.deal
                    )}
                />
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
        dealBestOffer: state.dealBestOffer,
    };
}

export default connect(mapStateToProps, Actions)(FinanceCalculator);
