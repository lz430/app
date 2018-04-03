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
import { makeDealBestOfferTotalValue, makeDealBestOfferLoading } from 'selectors/index';

class FinanceCalculator extends React.PureComponent {
    componentWillMount() {
        this.props.requestTargets(this.props.deal);
        this.props.requestBestOffer(this.props.deal);
    }

    updateDownPayment(e) {
        this.props.updateDownPayment(Math.max(e.target.value, 0));
    }

    updateTermDuration(e) {
        this.props.updateTermDuration(Number(e.target.value));
    }

    getTotalVehicleCost() {
        return formulas.calculateTotalCashFinance(
            util.getEmployeeOrSupplierPrice(
                this.props.deal,
                this.props.employeeBrand
            ),
            this.props.deal.doc_fee,
            0,
            this.props.dealBestOfferTotalValue
        );
    }

    getAmountToFinance() {
        return formulas.calculateTotalCashFinance(
                  util.getEmployeeOrSupplierPrice(
                      this.props.deal,
                      this.props.employeeBrand
                  ),
                  this.props.deal.doc_fee,
                  this.props.downPayment,
                  this.props.dealBestOfferTotalValue
              );
    }

    renderTotalCostOfVehicle() {
        const totalCostOfVehicle = this.getTotalVehicleCost();

        return (
            <div>
                <span className="cash-finance-lease-calculator__left-item">
                    Your price
                </span>
                <span className="cash-finance-lease-calculator__right-item">
                    {totalCostOfVehicle ? (
                        `${util.moneyFormat(totalCostOfVehicle)}*`
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
                    Rebates Applied
                </span>
                <span className="cash-finance-lease-calculator__right-item">
                    {this.props.dealBestOfferLoading ? (
                        <SVGInline svg={miscicons['loading']} />
                    ) : (
                        util.moneyFormat(this.props.dealBestOfferTotalValue)
                    )}
                </span>
            </div>
        );
    }

    renderAmountFinanced() {
        const totalAmountToFinance = this.getTotalVehicleCost();

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
        return (
            <div>
                <span className="cash-finance-lease-calculator__left-item">
                    Your Monthly Payment
                </span>
                <span className="cash-finance-lease-calculator__right-item">
                    {this.props.dealBestOfferLoading ? (
                        <SVGInline svg={miscicons['loading']} />
                    ) : (
                        `${util.moneyFormat(
                            Math.round(
                                formulas.calculateFinancedMonthlyPayments(
                                    util.getEmployeeOrSupplierPrice(
                                        this.props.deal,
                                        this.props.employeeBrand
                                    ) - this.props.dealBestOfferTotalValue,
                                    this.props.downPayment,
                                    this.props.termDuration
                                )
                            )
                        )}*`
                    )}
                </span>
            </div>
        );
    }

    handleTargetsChange() {
        this.props.requestBestOffer(this.props.deal);
    }

    render() {
        return (
            <div className="cash-finance-lease-calculator__calculator-content">
                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                    <div>
                        <CustomerTypeSelect {...R.pick(['deal', 'employeeBrand', 'setEmployeeBrand'], this.props)} />
                    </div>
                    <div>
                        Monthly Payments{' '}{util.moneyFormat(formulas.calculateFinancedMonthlyPayments(
                            util.getEmployeeOrSupplierPrice(
                                this.props.deal,
                                this.props.employeeBrand
                            ) - this.props.dealBestOfferTotalValue,
                            this.props.downPayment,
                            this.props.termDuration
                    ))}*
                    </div>
                </div>
                <hr />
                <Targets
                    deal={this.props.deal}
                    targetsChanged={this.handleTargetsChange.bind(this)}
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
                            Selling Price
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
                    {this.renderYourTargets()}
                    {this.renderTotalCostOfVehicle()}
                </div>
                <hr />
                <div>
                    <h4>Calculate Your Payment</h4>
                    {this.renderAmountFinanced()}
                    <div>
                        <span className="cash-finance-lease-calculator__left-item">
                            Down Payment
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
                {this.renderYourMonthlyFinancePayment()}
                <div className="accupricing-cta">
                    <a onClick={this.props.showAccuPricingModal}>
                        <img src="/images/accupricing-logo.png" className="accupricing-cta__logo" />
                    </a>
                    <p className="accupricing-cta__disclaimer">
                        * Includes taxes, dealer fees and rebates.
                    </p>
                </div>
            </div>
        );
    }
}

const makeMapStateToProps = () => {
    const getDealBestOfferTotalValue = makeDealBestOfferTotalValue();
    const getDealBestOfferLoading = makeDealBestOfferLoading();
    const mapStateToProps = (state, props) => {
        return {
            bestOffers: state.bestOffers,
            downPayment: state.downPayment,
            employeeBrand: state.employeeBrand,
            selectedTab: state.selectedTab,
            targetsSelected: state.targetsSelected,
            targetDefaults: state.targetDefaults,
            termDuration: state.termDuration,
            zipcode: state.zipcode,
            dealBestOfferTotalValue: getDealBestOfferTotalValue(state, props),
            dealBestOfferLoading: getDealBestOfferLoading(state, props),
        };
    };
    return mapStateToProps;
};

export default connect(makeMapStateToProps, Actions)(FinanceCalculator);
