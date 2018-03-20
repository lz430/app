import * as Actions from 'actions/index';
import { connect } from 'react-redux';
import formulas from 'src/formulas';
import miscicons from 'miscicons';
import PropTypes from 'prop-types';
import R from 'ramda';
import React from 'react';
import SVGInline from 'react-svg-inline';
import util from 'src/util';
import strings from 'src/strings';
import {
    makeDealBestOfferTotalValue,
    makeDealBestOffer,
} from 'selectors/index';

class InfoModalData extends React.PureComponent {
    componentDidMount() {
        this.props.requestTargets(this.props.deal);
        this.props.requestBestOffer(this.props.deal);
    }

    handleTabChange(tabName) {
        this.props.selectTab(tabName);
        this.props.getBestOffersForLoadedDeals();
    }

    renderTabs() {
        return (
            <div className="deal-price">
                <div className="tabs">
                    <div
                        onClick={() => {
                            this.handleTabChange('cash');
                        }}
                        className={`tabs__tab ${
                            this.props.selectedTab === 'cash'
                                ? 'tabs__tab--selected'
                                : ''
                            }`}
                    >
                        Cash
                    </div>
                    <div
                        onClick={() => {
                            this.handleTabChange('finance');
                        }}
                        className={`tabs__tab ${
                            this.props.selectedTab === 'finance'
                                ? 'tabs__tab--selected'
                                : ''
                            }`}
                    >
                        Finance
                    </div>
                    <div
                        onClick={() => {
                            this.handleTabChange('lease');
                        }}
                        className={`tabs__tab ${
                            this.props.selectedTab === 'lease'
                                ? 'tabs__tab--selected'
                                : ''
                            }`}
                    >
                        Lease
                    </div>
                </div>
            </div>
        );
    }

    calculateYourCashPrice()
    {
        switch (this.props.selectedTab) {
            case 'cash':
            case 'finance':
            case 'lease':
                return formulas.calculateTotalCash(
                    util.getEmployeeOrSupplierPrice(
                        this.props.deal,
                        this.props.employeeBrand
                    ),
                    this.props.deal.doc_fee,
                    this.props.dealBestOfferTotalValue
                );
        }
    }

    finalPrice() {
        switch (this.props.selectedTab) {
            case 'cash':
                return formulas.calculateTotalCash(
                    util.getEmployeeOrSupplierPrice(
                        this.props.deal,
                        this.props.employeeBrand
                    ),
                    this.props.deal.doc_fee,
                    this.props.dealBestOfferTotalValue
                );
            case 'finance': {
                return Math.round(
                    formulas.calculateFinancedMonthlyPayments(
                        util.getEmployeeOrSupplierPrice(
                            this.props.deal,
                            this.props.employeeBrand
                        ) - this.props.dealBestOfferTotalValue,
                        this.props.downPayment,
                        this.props.termDuration
                    )
                );
            }
            case 'lease': {
                return formulas.calculateTotalLeaseMonthlyPayment(
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
                );
            }
        }
    }

    handleGetRebatesLink() {
        this.props.selectDeal(this.props.deal);
        this.props.closeModal();
    }

    renderAppliedRebatesLink() {
        return (
            <div>
                <div className="info-modal-data__rebate-info info-modal-data__costs">
                    <div className="info-modal-data__rebate-info__title">
                        Rebates Applied:
                    </div>
                    <div>
                        {util.moneyFormat(this.props.dealBestOfferTotalValue)}
                    </div>
                </div>
            </div>
        );
    }

    renderPaymentDefaults() {
        const financeDownPaymentAmount = 0.1;
        const financeTermLength = '60';
        const leaseAnnualMiles = '10,000';
        const leaseTermLength = '36';
        const leaseCashDue = 500;

        if (this.props.selectedTab === 'finance') {
            return (
                <div>
                    <div className="info-modal-data__costs">
                        <div className="info-modal-data__label">
                            Down Payment:
                        </div>
                        <div className="info-modal-data__amount">{`${util.moneyFormat(
                            this.props.deal.supplier_price * financeDownPaymentAmount
                        )}`}</div>
                    </div>
                    <div className="info-modal-data__costs">
                        <div className="info-modal-data__label">
                            Total Months:
                        </div>
                        <div className="info-modal-data__amount">{financeTermLength}</div>
                    </div>
                    <div className="info-modal-data__costs info-modal-data__costs--final">
                        <div className="info-modal-data__label">
                            Monthly Payments:
                        </div>
                        <div className="info-modal-data__amount">{util.moneyFormat(this.finalPrice())}</div>
                    </div>
                </div>
            );
        } else {
            return (
                <div>

                    <div className="info-modal-data__costs">
                        <div className="info-modal-data__label">
                            Total Months:
                        </div>
                        <div className="info-modal-data__amount">{leaseTermLength}</div>
                    </div>
                    <div className="info-modal-data__costs">
                        <div className="info-modal-data__label">
                            Cash Due:
                        </div>
                        <div className="info-modal-data__amount">{util.moneyFormat(leaseCashDue)}</div>
                    </div>

                    <div className="info-modal-data__costs">
                        <div className="info-modal-data__label">
                            Annual Miles:
                        </div>
                        <div className="info-modal-data__amount">{leaseAnnualMiles}</div>
                    </div>
                    <div className="info-modal-data__costs info-modal-data__costs--final">
                        <div className="info-modal-data__label">
                            Monthly Payments:
                        </div>
                        <div className="info-modal-data__amount">{util.moneyFormat(this.finalPrice())}</div>
                    </div>
                </div>
            );
        }
    }

    render() {
        return (
            <div>
                <div className="info-modal-data">
                    <div className="info-modal-data__price">
                        <p className="info-modal-data__pricing-details">
                            Pricing
                        </p>

                        { this.renderTabs() }

                        <div className="info-modal-data__prices">
                            <div className="info-modal-data__costs">
                                <div className="info-modal-data__label">
                                    MSRP:{' '}
                                </div>
                                <div className="info-modal-data__amount">
                                    {util.moneyFormat(this.props.deal.msrp)}
                                </div>
                            </div>
                            <div className="info-modal-data__costs">
                                <div className="info-modal-data__label">
                                    Selling Price:
                                </div>
                                <div className="info-modal-data__amount">{`${util.moneyFormat(
                                    this.props.deal.supplier_price
                                )}`}</div>
                            </div>

                            {this.props.selectedTab === 'cash' &&
                                <div className="info-modal-data__costs info-modal-data__costs--final">
                                    <div className="info-modal-data__label">
                                        Your Price:
                                    </div>
                                    <div className="info-modal-data__amount">{util.moneyFormat(this.calculateYourCashPrice())}*</div>
                                </div>
                            }

                            {this.props.selectedTab !== 'cash' &&
                                <div>
                                    <hr />
                                    <div>{this.renderPaymentDefaults()}</div>
                                </div>
                            }
                        </div>
                        <hr />

                        <div className="info-modal-data__more-rebates info-modal-data__costs">
                            <div>
                                Additional rebates may apply. {' '}
                                <a
                                    onClick={this.handleGetRebatesLink.bind(this)}
                                    className="link"
                                >
                                    See more
                                </a>
                            </div>
                        </div>

                        <div className="deal__buttons">
                            <button
                                className={this.compareButtonClass()}
                                onClick={this.props.toggleCompare.bind(
                                    null,
                                    this.props.deal
                                )}
                            >
                                {this.isAlreadyInCompareList() ? 'Remove from compare' : 'Compare'}
                            </button>
                            <button
                                onClick={() => this.selectDeal()}
                                className="deal__button deal__button--small deal__button--pink deal__button"
                            >
                                Get Quote
                            </button>
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

                    {this.props.children}
                </div>
            </div>
        );
    }

    isAlreadyInCompareList() {
        return R.contains(this.props.deal, R.map(R.prop('deal'), this.props.compareList));
    }

    compareButtonClass() {
        return (
            'deal__button deal__button--small deal__button--blue' +
            (this.isAlreadyInCompareList()
                ? 'deal__button--blue'
                : '')
        );
    }

    selectDeal() {
        this.props.closeModal();
        this.props.selectDeal(this.props.deal);
    }
}

InfoModalData.propTypes = {
    deal: PropTypes.shape({
        year: PropTypes.string.isRequired,
        msrp: PropTypes.number.isRequired,
        employee_price: PropTypes.number.isRequired,
        supplier_price: PropTypes.number.isRequired,
        make: PropTypes.string.isRequired,
        model: PropTypes.string.isRequired,
        id: PropTypes.number.isRequired,
        vin: PropTypes.string.isRequired,
    }),
    closeModal: PropTypes.func.isRequired,
};

const makeMapStateToProps = () => {
    const getDealBestOfferTotalValue = makeDealBestOfferTotalValue();
    const getDealBestOffer = makeDealBestOffer();
    const mapStateToProps = (state, props) => {
        return {
            downPayment: state.downPayment,
            employeeBrand: state.employeeBrand,
            residualPercent: state.residualPercent,
            selectedTab: state.selectedTab,
            selectedDeal: state.selectedDeal,
            termDuration: state.termDuration,
            dealBestOfferTotalValue: getDealBestOfferTotalValue(state, props),
            dealBestOffer: getDealBestOffer(state, props),
            compareList: state.compareList,
        };
    };
    return mapStateToProps;
};

export default connect(makeMapStateToProps, Actions)(InfoModalData);
