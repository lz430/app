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
import {
    makeDealBestOfferTotalValue,
    makeDealBestOfferLoading,
} from 'selectors/index';

class DealPrice extends React.PureComponent {
    renderPriceExplanationModal() {
        return <InfoModal deal={this.props.deal} />;
    }

    renderCashPrice() {
        return (
            <div className="deal-price__price">
                <div className="deal-price__cash-label">Your cash price</div>
                <div className="deal-price__cash-price">
                    <div>
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
                    </div>
                    {this.renderPriceExplanationModal()}
                </div>
                <div className="deal-price__hr" />
                <div className="deal-price__cash-msrp">
                    {util.moneyFormat(this.props.deal.msrp)}{' '}
                    <span className="deal-price__cash-msrp-label">MSRP</span>
                </div>
            </div>
        );
    }

    renderFinancePrice() {
        return (
            <div className="deal-price__price">
                <div className="deal-price__finance-lease-label">
                    Estimated Monthly Finance Payment
                </div>
                <div className="deal-price__finance-lease-price">
                    {this.props.dealBestOfferLoading ? (
                        <SVGInline svg={miscicons['loading']} />
                    ) : (
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
                            formulas.calculateTotalLeaseMonthlyPayment(
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

    handleTabChange(tabName) {
        this.props.selectTab(tabName);
        this.props.getBestOffersForLoadedDeals();
    }

    render() {
        return (
            <div className="deal-price">
                <div className="tabs__content">{this.renderSelectedTab()}</div>
            </div>
        );
    }
}

const makeMapStateToProps = () => {
    const getDealBestOfferTotalValue = makeDealBestOfferTotalValue();
    const getDealBestOfferLoading = makeDealBestOfferLoading();
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
            dealBestOfferTotalValue: getDealBestOfferTotalValue(state, props),
            dealBestOfferLoading: getDealBestOfferLoading(state, props),
        };
    };
    return mapStateToProps;
};

DealPrice.PropTypes = {
    deal: PropTypes.object.isRequired,
};

export default connect(makeMapStateToProps, Actions)(DealPrice);
