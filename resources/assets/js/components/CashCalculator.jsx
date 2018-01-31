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
                Cash Price{' '}
                {util.moneyFormat(
                    util.getEmployeeOrSupplierPrice(
                        this.props.deal,
                        this.props.employeeBrand
                    )
                )}
                <CustomerTypeSelect deal={this.props.deal} />
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
                            Total Cost of Vehicle
                        </span>
                        <span className="cash-finance-lease-calculator__right-item">
                            {this.props.dealBestOfferLoading ? (
                                <SVGInline svg={miscicons['loading']} />
                            ) : (
                                util.moneyFormat(
                                    formulas.calculateTotalCash(
                                        util.getEmployeeOrSupplierPrice(
                                            this.props.deal,
                                            this.props.employeeBrand
                                        ),
                                        this.props.deal.doc_fee,
                                        this.props.dealBestOfferTotalValue
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
