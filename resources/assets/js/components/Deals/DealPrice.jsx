import React from 'react';
import R from 'ramda';
import PropTypes from 'prop-types';
import util from 'src/util';
import formulas from 'src/formulas';
import { connect } from 'react-redux';
import * as Actions from 'actions/index';
import SVGInline from 'react-svg-inline';
import miscicons from 'miscicons';
import InfoModal from 'components/InfoModal';
import {makeDealBestOfferTotalValue} from 'selectors/index';

class DealPrice extends React.PureComponent {
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

    renderPriceExplanationModal() {
        return <InfoModal deal={this.props.deal} />;
    }

    renderCashPrice() {
        return <div className="deal-price__price">
                <div className="deal-price__cash-label">
                    Your cash price
                </div>
                <div className="deal-price__cash-price">
                    <div>
                        {!R.isNil(this.props.dealBestOfferTotalValue) ? (
                                util.moneyFormat(
                                    formulas.calculateTotalCashFinance(
                                        util.getEmployeeOrSupplierPrice(
                                            this.props.deal,
                                            this.props.employeeBrand
                                        ),
                                        this.props.deal.doc_fee,
                                        this.props.downPayment,
                                        this.props.dealBestOfferTotalValue
                                    ))
                            ) : (
                                <SVGInline svg={miscicons['loading']} />
                            )}
                    </div>
                    {this.renderPriceExplanationModal()}
                </div>
                <div className="deal-price__hr" />
                <div className="deal-price__cash-msrp">
                    {util.moneyFormat(this.props.deal.msrp)} <span className="deal-price__cash-msrp-label">
                        MSRP
                    </span>
                </div>
            </div>;
    }

    renderFinancePrice() {
        return (
            <div className="deal-price__price">
                <div className="deal-price__finance-lease-label">
                    Estimated Monthly Finance Payment
                </div>
                <div className="deal-price__finance-lease-price">
                    {!R.isNil(this.props.dealBestOfferTotalValue) ? (
                        <div>
                            {util.moneyFormat(
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
                            )}
                        </div>
                    ) : (
                        <SVGInline svg={miscicons['loading']} />
                    )}
                    {this.renderPriceExplanationModal()}
                </div>
                <div className="deal-price__hr" />
            </div>
        );
    }

    renderLeasePrice() {
        return (
            <div className="deal-price__price">
                <div className="deal-price__finance-lease-label">
                    Estimated Monthly Lease Payment
                </div>
                <div className="deal-price__finance-lease-price">
                    <div>
                        {util.moneyFormat(
                            Math.round(
                                formulas.calculateLeasedMonthlyPayments(
                                    util.getEmployeeOrSupplierPrice(
                                        this.props.deal,
                                        this.props.employeeBrand
                                    ) - this.props.dealBestOfferTotalValue,
                                    0,
                                    0,
                                    this.props.termDuration,
                                    R.or(this.props.residualPercent, 31)
                                )
                            )
                        )}
                    </div>
                    {this.renderPriceExplanationModal()}
                </div>
                <div className="deal-price__hr" />
            </div>
        );
    }

    renderSelectedTab() {
        switch (this.props.selectedTab) {
            case 'cash':
                return this.renderCashPrice();
            case 'finance':
                return this.renderFinancePrice();
            case 'lease':
                return this.renderLeasePrice();
        }
    }

    renderAppliedTargetsLink() {
        return (
            <div className="deal-price__rebates-applied">
                <SVGInline
                    height="10px"
                    width="10px"
                    className="deal-price__tag-icon"
                    svg={miscicons['tag']}
                />
                <a
                    onClick={() => this.props.selectDeal(this.props.deal)}
                    href="#"
                >
                    See Available Targets or something
                </a>
            </div>
        );
    }

    render() {
        return (
            <div className="deal-price">
                <div className="tabs">
                    <div
                        onClick={this.props.selectTab.bind(null, 'cash')}
                        className={`tabs__tab ${
                            this.props.selectedTab === 'cash'
                                ? 'tabs__tab--selected'
                                : ''
                        }`}
                    >
                        Cash
                    </div>
                    <div
                        onClick={this.props.selectTab.bind(null, 'finance')}
                        className={`tabs__tab ${
                            this.props.selectedTab === 'finance'
                                ? 'tabs__tab--selected'
                                : ''
                        }`}
                    >
                        Finance
                    </div>
                    <div
                        onClick={this.props.selectTab.bind(null, 'lease')}
                        className={`tabs__tab ${
                            this.props.selectedTab === 'lease'
                                ? 'tabs__tab--selected'
                                : ''
                        }`}
                    >
                        Lease
                    </div>
                </div>
                <div className="tabs__content">{this.renderSelectedTab()}</div>
                {this.renderAppliedTargetsLink()}
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        employeeBrand: state.employeeBrand,
        downPayment: state.downPayment,
        termDuration: state.termDuration,
        residualPercent: state.residualPercent,
        selectedTab: state.selectedTab,
        dealTargets: state.dealTargets,
        bestOffers: state.bestOffers,
        zipcode: state.zipcode,
        targetsSelected: state.targetsSelected,
        targetDefaults: state.targetDefaults,
        bestOffers: state.bestOffers,
        selectedTab: state.selectedTab,
        downPayment: state.downPayment,
    };
};


const makeMapStateToProps = () => {
    const getDealBestOfferTotalValue = makeDealBestOfferTotalValue();
    const mapStateToProps = (state, props) => {
        return {
            employeeBrand: state.employeeBrand,
            downPayment: state.downPayment,
            termDuration: state.termDuration,
            residualPercent: state.residualPercent,
            selectedTab: state.selectedTab,
            dealTargets: state.dealTargets,
            bestOffers: state.bestOffers,
            zipcode: state.zipcode,
            targetsSelected: state.targetsSelected,
            targetDefaults: state.targetDefaults,
            bestOffers: state.bestOffers,
            selectedTab: state.selectedTab,
            downPayment: state.downPayment,
            dealBestOfferTotalValue: getDealBestOfferTotalValue(state, props)
        };
    }
    return mapStateToProps;
}

DealPrice.PropTypes = {
    deal: PropTypes.object.isRequired,
};

export default connect(makeMapStateToProps, Actions)(DealPrice);
