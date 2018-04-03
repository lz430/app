import React from 'react';
import util from 'src/util';
import R from 'ramda';
import Targets from 'components/Targets';
import CustomerTypeSelect from 'components/CustomerTypeSelect';
import { connect } from 'react-redux';
import * as Actions from 'actions';
import formulas from 'src/formulas';
import SVGInline from 'react-svg-inline';
import miscicons from 'miscicons';
import { makeDealBestOfferTotalValue, makeDealBestOfferLoading } from 'selectors/index';

class CashCalculator extends React.PureComponent {
    componentWillMount() {
        this.props.requestTargets(this.props.deal);
        this.props.requestBestOffer(this.props.deal);
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
                        Your Price{' '}{util.moneyFormat(formulas.calculateTotalCash(
                        util.getEmployeeOrSupplierPrice(
                            this.props.deal,
                            this.props.employeeBrand
                        ),
                        this.props.deal.doc_fee,
                        this.props.dealBestOfferTotalValue
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
                            {util.moneyFormat(util.getEmployeeOrSupplierPrice(this.props.deal, this.props.employeeBrand))}
                        </span>
                    </div>
                    <div>
                        <span className="cash-finance-lease-calculator__left-item">
                            Rebates Applied
                        </span>
                        <span className="cash-finance-lease-calculator__right-item">
                            {this.props.dealBestOfferLoading ? (
                                <SVGInline svg={miscicons['loading']} />
                            ) : (
                                util.moneyFormat(
                                    this.props.dealBestOfferTotalValue
                                )
                            )}
                        </span>
                    </div>
                    <div>
                        <span className="cash-finance-lease-calculator__left-item">
                            Your Price
                        </span>
                        <span className="cash-finance-lease-calculator__right-item">
                            {this.props.dealBestOfferLoading ? (
                                <SVGInline svg={miscicons['loading']} />
                            ) : (
                                `${util.moneyFormat(
                                    formulas.calculateTotalCash(
                                        util.getEmployeeOrSupplierPrice(
                                            this.props.deal,
                                            this.props.employeeBrand
                                        ),
                                        this.props.deal.doc_fee,
                                        this.props.dealBestOfferTotalValue
                                    )
                                )}*`
                            )}
                        </span>
                    </div>
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
            bestOffers: state.bestOffers,
            downPayment: state.downPayment,
            employeeBrand: state.employeeBrand,
            selectedTab: state.selectedTab,
            targetsSelected: state.targetsSelected,
            targetDefaults: state.targetDefaults,
            zipcode: state.zipcode,
            dealBestOfferTotalValue: getDealBestOfferTotalValue(state, props),
            dealBestOfferLoading: getDealBestOfferLoading(state, props),
        };
    };
    return mapStateToProps;
};

export default connect(makeMapStateToProps, Actions)(CashCalculator);
