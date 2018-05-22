import React from 'react';
import util from 'src/util';
import R from 'ramda';
import Targets from 'components/Targets';
import CustomerTypeSelect from 'components/CustomerTypeSelect';
import formulas from 'src/formulas';
import { connect } from 'react-redux';
import api from 'src/api';
import * as Actions from 'actions';
import SVGInline from 'react-svg-inline';
import miscicons from 'miscicons';
import { makeDealBestOfferTotalValue, makeDealBestOfferLoading } from 'selectors/index';
import CustomizeQuoteOrBuyNowButton from "./CustomizeQuoteOrBuyNowButton";

class LeaseCalculator extends React.PureComponent {
    showWhenPricingIsLoaded(fn) {
        return this.props.dealPricing.isPricingLoading() ? (
            <SVGInline svg={miscicons['loading']} />
        ) : fn();
    }

    renderYourTargets() {
        return (
            <div>
                <span className="cash-finance-lease-calculator__left-item">
                    Rebates Applied
                </span>
                <span className="cash-finance-lease-calculator__right-item">
                    {this.showWhenPricingIsLoaded(() => this.props.dealPricing.bestOffer())}
                </span>
            </div>
        );
    }

    renderTotalCostOfVehicle() {
        return (
            <div>
                <span className="cash-finance-lease-calculator__left-item">
                    Your price
                </span>
                <span className="cash-finance-lease-calculator__right-item">
                    {this.showWhenPricingIsLoaded(() => this.props.dealPricing.yourPrice())}
                </span>
            </div>
        );
    }

    handleTargetsChange() {
        this.props.requestBestOffer(this.props.deal);
    }

    render() {
        if (this.props.dealPricing.isPricingAvailable() && this.props.dealPricing.cannotPurchase()) {
            // Pricing is completely and we do not have any lease terms. This means that we cannot
            // calculate lease pricing at all.
            return (
                <div className="cash-finance-lease-calculator__calculator-content">
                    <h4>Currently there are no competitive lease rates available on this vehicle.</h4>
                </div>
            )
        }

        return (
            <div className="cash-finance-lease-calculator__calculator-content">
                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                    <div>
                        <CustomerTypeSelect
                            {...R.pick(['deal', 'employeeBrand', 'setEmployeeBrand'], this.props)}
                            onChange={(deal) => this.props.requestBestOffer(this.props.dealPricing.deal())}
                        />
                    </div>
                    <div>
                        Your Monthly Payment{' '}{this.showWhenPricingIsLoaded(() => this.props.dealPricing.monthlyPayments())}*
                    </div>
                </div>
                <hr />
                <Targets
                    deal={this.props.deal}
                    targetsChanged={this.handleTargetsChange.bind(this)}
                />
                <hr />
                <div>
                    <h4>Select Desired Lease Payment</h4>
                    <div className="cash-finance-lease-calculator__lease-table-container">
                        <table className="cash-finance-lease-calculator__lease-table">
                            <thead>
                                <tr>
                                    <td className="cash-finance-lease-calculator__lease-table-cell--darker">
                                        Cash Due
                                    </td>
                                    {this.props.dealPricing.leaseTermsAvailable() && this.props.dealPricing.leaseTermsAvailable().filter(term => {
                                        return this.props.dealPricing.hasLeasePaymentsForTerm(term);
                                    }).map((term, index) => {
                                            return (
                                                <td
                                                    className="cash-finance-lease-calculator__lease-table-cell--dark"
                                                    key={index}
                                                >
                                                    {term}{' '}
                                                    Months
                                                </td>
                                            )
                                        })
                                    }
                                </tr>
                            </thead>
                            <tbody>
                            {this.props.dealPricing.leaseTermsAvailable() && this.props.dealPricing.leaseCashDownAvailable() && this.props.dealPricing.leaseCashDownAvailable().map((cashDown, indexCashDown) => {
                                return (
                                    <tr key={indexCashDown}>
                                        <td className="cash-finance-lease-calculator__lease-table-cell--darker">
                                            {util.moneyFormat(cashDown)}
                                        </td>
                                        {this.props.dealPricing.leaseTermsAvailable().filter(term => {
                                            return this.props.dealPricing.hasLeasePaymentsForTerm(term);
                                        }).map((term, termIndex) => {
                                            let className = this.props.dealPricing.isSelectedLeasePaymentForTermAndCashDown(term, cashDown) ?
                                                'cash-finance-lease-calculator__lease-table-cell--selected' :
                                                'cash-finance-lease-calculator__lease-table-cell--selectable';

                                            return (
                                                <td className={className} key={termIndex} onClick={e => {
                                                    this.props.updateLeaseTerm(this.props.deal, term);
                                                    this.props.updateLeaseCashDown(this.props.deal, cashDown);
                                                }}>
                                                    {this.props.dealPricing.leasePaymentsForTermAndCashDown(term, cashDown)}
                                                </td>

                                            )
                                        })}
                                    </tr>
                                )
                            })}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div>
                    <h4>Lease Summary</h4>
                </div>
                <div>
                    <div style={{clear: 'both'}}>
                        <span>Annual Mileage</span>
                        <span style={{ float: 'right' }}>
                            <select value={this.props.dealPricing.leaseAnnualMileageValue()} onChange={e => this.props.updateLeaseAnnualMileage(this.props.deal, e.target.value)} >
                                {this.props.dealPricing.leaseAnnualMileageAvailable().map((annualMileage, annualMileageIndex) => {
                                    return (
                                        <option key={annualMileageIndex} value={annualMileage}>{annualMileage}</option>
                                    )
                                })}
                            </select>
                        </span>
                    </div>
                    <div style={{clear: 'both'}}>
                        <span>Term</span>
                        <span style={{ float: 'right' }}>
                            {this.props.dealPricing.leaseTerm()}
                        </span>
                    </div>
                    <div style={{clear: 'both'}}>
                        <span>Cash Down</span>
                        <span style={{ float: 'right' }}>
                            {this.props.dealPricing.leaseCashDown()}
                        </span>
                    </div>
                    <div style={{clear: 'both'}}>
                        <span>Monthly Payment</span>
                        <span style={{ float: 'right' }}>
                            {this.props.dealPricing.monthlyPayments()}*
                        </span>
                    </div>
                </div>
                <hr />
                <h4>Summary</h4>
                <div>
                    <div>
                        <span className="cash-finance-lease-calculator__left-item">
                            MSRP
                        </span>
                        <span className="cash-finance-lease-calculator__right-item">
                            {this.showWhenPricingIsLoaded(() => this.props.dealPricing.msrp())}
                        </span>
                    </div>
                    <div>
                        <span className="cash-finance-lease-calculator__left-item">
                            Selling Price
                        </span>
                        <span className="cash-finance-lease-calculator__right-item">
                            {this.showWhenPricingIsLoaded(() => this.props.dealPricing.sellingPrice())}
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
        )
    }
}

const makeMapStateToProps = () => {
    const getDealBestOfferTotalValue = makeDealBestOfferTotalValue();
    const getDealBestOfferLoading = makeDealBestOfferLoading();
    const mapStateToProps = (state, props) => {
        return {
            zipcode: state.zipcode,
            termDuration: state.termDuration,
            annualMileage: state.annualMileage,
            residualPercent: state.residualPercent,
            employeeBrand: state.employeeBrand,
            dealBestOfferTotalValue: getDealBestOfferTotalValue(state, props),
            dealBestOfferLoading: getDealBestOfferLoading(state, props),
        };
    };
    return mapStateToProps;
};

export default connect(makeMapStateToProps, Actions)(LeaseCalculator);
