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

class LeaseCalculator extends React.PureComponent {
    constructor(props) {
        super(props);

        this.state = {};
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
                        this.props.dealPricing.bestOffer()
                    )}
                </span>
            </div>
        );
    }

    renderTotalCostOfVehicle() {
        const totalCostOfVehicle = this.props.dealPricing.yourPrice();

        return (
            <div>
                <span className="cash-finance-lease-calculator__left-item">
                    Your price
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

    handleTargetsChange() {
        this.props.requestBestOffer(this.props.deal);
    }

    render() {
        return this.state.leaseRates && this.state.leaseRates.length == 0 ? (
            <div className="cash-finance-lease-calculator__calculator-content">
                <h4>Currently there are no competitive lease rates available on this vehicle.</h4>
            </div>
        ) : (
            <div className="cash-finance-lease-calculator__calculator-content">
                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                    <div>
                        <CustomerTypeSelect {...R.pick(['deal', 'employeeBrand', 'setEmployeeBrand'], this.props)} />
                    </div>
                    <div>
                        Your price{' '}{this.props.dealPricing.yourPrice()}*
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
                <hr />
                <div>
                    <h4>Lease Summary</h4>
                </div>
                <div>
                    <div style={{clear: 'both'}}>
                        <span>Term</span>
                        <span style={{ float: 'right' }}>
                            <select value={this.props.dealPricing.leaseTermValue()} onChange={e => this.props.updateLeaseTerm(this.props.deal, e.target.value)} >
                                {this.props.dealPricing.leaseTermsAvailable().map((term, termIndex) => {
                                    return (
                                        <option key={termIndex} value={term}>{term} Months</option>
                                    )
                                })}
                            </select>
                        </span>
                    </div>
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

                    <h4>Select Desired Lease Payment</h4>
                    <table className="cash-finance-lease-calculator__lease-table">
                        <thead>
                            <tr>
                                <td className="cash-finance-lease-calculator__lease-table-cell--darker">
                                    Cash Due
                                </td>
                                {this.props.dealPricing.leaseTermsAvailable() && this.props.dealPricing.leaseTermsAvailable().map((term, index) => {
                                    return (
                                        <td
                                            className="cash-finance-lease-calculator__lease-table-cell--dark"
                                            key={index}
                                        >
                                            {term}{' '}
                                            Months
                                        </td>
                                    )
                                })}
                            </tr>
                        </thead>
                        <tbody>
                        {this.props.dealPricing.leaseTermsAvailable() && this.props.dealPricing.leaseCashDownAvailable() && this.props.dealPricing.leaseCashDownAvailable().map((cashDown, indexCashDown) => {
                            return (
                                <tr key={indexCashDown}>
                                    <td className="cash-finance-lease-calculator__lease-table-cell--darker">
                                        {util.moneyFormat(cashDown)}
                                    </td>
                                    {this.props.dealPricing.leaseTermsAvailable().map((term, termIndex) => {
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
