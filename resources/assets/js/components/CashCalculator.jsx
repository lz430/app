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

class CashCalculator extends React.PureComponent {
    componentWillMount() {
        this.props.requestTargets(this.props.deal);
        this.props.requestBestOffer(this.props.deal);
    }

    bestOfferTotalValue() {
        const targetKey = util.getTargetKeyForDealAndZip(this.props.deal, this.props.zipcode);
        const selectedTargetIds = this.props.targetsSelected[targetKey]
            ? R.map(R.prop('targetId'), this.props.targetsSelected[targetKey])
            : [];
        const targets = R.uniq(this.props.targetDefaults.concat(selectedTargetIds));
        const bestOfferKey = util.getBestOfferKeyForDeal(this.props.deal, this.props.zipcode, this.props.selectedTab, targets);
        const result = R.prop(bestOfferKey, this.props.bestOffers) ? R.prop('totalValue', R.prop(bestOfferKey, this.props.bestOffers)) : 0;
        return result;
    }

    handleTargetsChange() {
        this.props.requestBestOffer(this.props.deal);
    }

    render() {
        const bestOfferTotalValue = this.bestOfferTotalValue();
        return <div>
                Cash Price {util.moneyFormat(util.getEmployeeOrSupplierPrice(this.props.deal, this.props.employeeBrand))}
                <CustomerTypeSelect deal={this.props.deal} />
                <hr />
                <Targets deal={this.props.deal} targetsChanged={this.handleTargetsChange.bind(this)} />
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
                            {!R.isNil(bestOfferTotalValue) ? (
                                util.moneyFormat(bestOfferTotalValue)
                            ) : (
                                <SVGInline svg={miscicons['loading']} />
                            )}
                        </span>
                    </div>
                    <div>
                        <span className="cash-finance-lease-calculator__left-item">
                            Total Cost of Vehicle
                        </span>
                        <span className="cash-finance-lease-calculator__right-item">
                            {!R.isNil(bestOfferTotalValue) ? (
                                util.moneyFormat(
                                    formulas.calculateTotalCashFinance(
                                        util.getEmployeeOrSupplierPrice(
                                            this.props.deal,
                                            this.props.employeeBrand
                                        ),
                                        this.props.deal.doc_fee,
                                        this.props.downPayment,
                                        bestOfferTotalValue
                                    ))
                            ) : (
                                <SVGInline svg={miscicons['loading']} />
                            )}
                        </span>
                    </div>
                </div>
            </div>;
    }
}

function mapStateToProps(state) {
    return {
        bestOffers: state.bestOffers,
        deal: state.selectedDeal,
        downPayment: state.downPayment,
        employeeBrand: state.employeeBrand,
        selectedTab: state.selectedTab,
        targetsSelected: state.targetsSelected,
        targetDefaults: state.targetDefaults,
        zipcode: state.zipcode,
    };
}

export default connect(mapStateToProps, Actions)(CashCalculator);
