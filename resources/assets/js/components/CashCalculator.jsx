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
    componentWillUnmount() {
        this.props.clearBestOffer();
    }

    render() {
        const bestOfferTotalValue = this.props.dealBestOffer
            ? this.props.dealBestOffer.totalValue
            : 0;
        return <div>
                Cash Price {util.moneyFormat(util.getEmployeeOrSupplierPrice(this.props.deal, this.props.employeeBrand))}
                <CustomerTypeSelect deal={this.props.deal} />
                <hr />
                <Targets deal={this.props.deal} targetsChanged={this.props.requestBestOffer.bind(this, this.props.deal)} />
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
                            {this.props.dealBestOffer ? (
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
                            {util.moneyFormat(
                                formulas.calculateTotalCashFinance(
                                    util.getEmployeeOrSupplierPrice(
                                        this.props.deal,
                                        this.props.employeeBrand
                                    ),
                                    this.props.deal.doc_fee,
                                    this.props.downPayment,
                                    bestOfferTotalValue
                                )
                            )}
                        </span>
                    </div>
                </div>
            </div>;
    }
}

function mapStateToProps(state) {
    return {
        deal: state.selectedDeal,
        downPayment: state.downPayment,
        employeeBrand: state.employeeBrand,
        dealBestOffer: state.dealBestOffer,
    };
}

export default connect(mapStateToProps, Actions)(CashCalculator);
