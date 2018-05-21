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
        this.props.requestTargets(this.props.dealPricing.deal());
        this.props.requestBestOffer(this.props.dealPricing.deal());
    }

    handleTargetsChange() {
        this.props.requestBestOffer(this.props.dealPricing.deal());
    }

    updateDownPayment(e) {
        this.props.updateFinanceDownPayment(Math.max(e.target.value, 0));
    }

    updateTermDuration(e) {
        this.props.updateFinanceTerm(Number(e.target.value));
    }

    showWhenPricingIsLoaded(fn) {
        return this.props.dealPricing.isPricingLoading() ? (
            <SVGInline svg={miscicons['loading']} />
        ) : fn();
    }

    renderTotalCostOfVehicle() {
        const totalCostOfVehicle = this.props.dealPricing.yourPrice();

        return (
            <div>
                <span className="cash-finance-lease-calculator__left-item">
                    Your Price
                </span>
                <span className="cash-finance-lease-calculator__right-item">
                    {totalCostOfVehicle ? (
                        `${totalCostOfVehicle}*`
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
                    {this.props.dealPricing.bestOfferIsLoading() ? (
                        <SVGInline svg={miscicons['loading']} />
                    ) : (
                        this.props.dealPricing.bestOffer()
                    )}
                </span>
            </div>
        );
    }

    renderAmountFinanced() {
        const totalAmountToFinance = this.props.dealPricing.amountFinanced();

        return (
            <div>
                <span className="cash-finance-lease-calculator__left-item">
                    Amount Financed
                </span>
                <span className="cash-finance-lease-calculator__right-item">
                    {totalAmountToFinance ? (
                        totalAmountToFinance
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
                    {this.props.dealPricing.bestOfferIsLoading() ? (
                        <SVGInline svg={miscicons['loading']} />
                    ) :
                        this.props.dealPricing.monthlyPayments()
                    }*
                </span>
            </div>
        );
    }

    render() {
        return (
            <div className="cash-finance-lease-calculator__calculator-content">
                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                    <div>
                        <CustomerTypeSelect {...R.pick(['deal', 'employeeBrand', 'setEmployeeBrand'], this.props)} />
                    </div>
                    <div>
                        Your Monthly Price{' '}{this.showWhenPricingIsLoaded(() => this.props.dealPricing.monthlyPayments())}*
                    </div>
                </div>
                <hr />
                <Targets
                    deal={this.props.dealPricing.deal()}
                    targetsChanged={() => this.handleTargetsChange()}
                />
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
                                value={this.props.dealPricing.financeDownPaymentValue()}
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
                                value={this.props.dealPricing.financeTermValue()}
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
                <hr />
                <h4>Summary</h4>
                <div>
                    <div>
                        <span className="cash-finance-lease-calculator__left-item">
                            MSRP
                        </span>
                        <span className="cash-finance-lease-calculator__right-item">
                            {this.props.dealPricing.msrp()}
                        </span>
                    </div>
                    <div>
                        <span className="cash-finance-lease-calculator__left-item">
                            Selling Price
                        </span>
                        <span className="cash-finance-lease-calculator__right-item">
                            {this.props.dealPricing.sellingPrice()}
                        </span>
                    </div>
                    {this.renderYourTargets()}
                    {this.renderTotalCostOfVehicle()}
                </div>
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
    const mapStateToProps = (state, props) => {
        return {
            deal: props.dealPricing.deal(),
            employeeBrand: props.dealPricing.employeeBrand()
        };
    };
    return mapStateToProps;
};

export default connect(makeMapStateToProps, Actions)(FinanceCalculator);
