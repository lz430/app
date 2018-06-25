import R from 'ramda';
import React from 'react';
import CustomizeQuoteOrBuyNowButton from 'components/CustomizeQuoteOrBuyNowButton';
import strings from 'src/strings';
import SVGInline from 'react-svg-inline';
import miscicons from 'miscicons';
import Line from '../containers/dealDetails/components/pricing/Line';
import Label from '../containers/dealDetails/components/pricing/Label';
import Value from '../containers/dealDetails/components/pricing/Value';

class InfoModalData extends React.PureComponent {
    static defaultProps = {
        withPricingHeader: true,
        withPricingTabs: true,
        withCompareInsteadOfBack: true,
        withFinalSelectionHeader: false,
        withCustomizeQuoteOrBuyNow: true,
        withConfirmPurchase: false,
    };

    componentDidMount() {
        this.props.requestTargets(this.props.dealPricing.deal());
        this.props.requestBestOffer(this.props.dealPricing.deal());
    }

    handleTabChange(tabName) {
        this.props.selectTab(tabName);
        this.props.requestBestOffer(this.props.dealPricing.deal());
    }

    showWhenPricingIsLoaded(fn) {
        if (this.props.dealPricing.isPricingLoading()) {
            return <SVGInline svg={miscicons['loading']} />;
        }

        if (this.props.dealPricing.cannotPurchase()) {
            return <span>N/A</span>;
        }

        return fn();
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

    handleGetRebatesLink() {
        this.props.selectDeal(this.props.dealPricing.deal());
        if (this.props.closeModal) {
            this.props.closeModal();
        }
    }

    renderAppliedRebatesLink() {
        return (
            <div>
                <div className="info-modal-data__rebate-info info-modal-data__costs">
                    <div className="info-modal-data__rebate-info__title">
                        Rebates Applied:
                    </div>
                    <div>
                        {this.showWhenPricingIsLoaded(() =>
                            this.props.dealPricing.bestOffer()
                        )}
                    </div>
                </div>
            </div>
        );
    }

    renderPaymentDefaults() {
        if (this.props.selectedTab === 'finance') {
            return (
                <div>
                    <div className="info-modal-data__costs">
                        <div className="info-modal-data__label">
                            Down Payment:
                        </div>
                        <div className="info-modal-data__amount">
                            {this.showWhenPricingIsLoaded(() =>
                                this.props.dealPricing.financeDownPayment()
                            )}
                        </div>
                    </div>
                    <div className="info-modal-data__costs">
                        <div className="info-modal-data__label">
                            Total Months:
                        </div>
                        <div className="info-modal-data__amount">
                            {this.showWhenPricingIsLoaded(() =>
                                this.props.dealPricing.financeTerm()
                            )}
                        </div>
                    </div>
                    <div className="info-modal-data__costs info-modal-data__costs--final-payments">
                        <div className="info-modal-data__label">
                            Monthly Payments:
                        </div>
                        <div className="info-modal-data__amount">
                            {this.showWhenPricingIsLoaded(() =>
                                this.props.dealPricing.finalPrice()
                            )}*
                        </div>
                    </div>
                </div>
            );
        } else {
            if (
                this.props.dealPricing.isPricingAvailable() &&
                this.props.dealPricing.hasNoLeaseTerms()
            ) {
                return (
                    <div className="cash-finance-lease-calculator__calculator-content">
                        <h4>
                            Currently there are no competitive lease rates
                            available on this vehicle.
                        </h4>
                    </div>
                );
            }

            return (
                <div>
                    <div className="info-modal-data__costs">
                        <div className="info-modal-data__label">
                            Total Months:
                        </div>
                        <div className="info-modal-data__amount">
                            {this.showWhenPricingIsLoaded(() =>
                                this.props.dealPricing.leaseTerm()
                            )}
                        </div>
                    </div>
                    {/*
                    <div className="info-modal-data__costs">
                        <div className="info-modal-data__label">Cash Due:</div>
                        <div className="info-modal-data__amount">
                            {this.showWhenPricingIsLoaded(() =>
                                this.props.dealPricing.leaseCashDue()
                            )}
                        </div>
                    </div>
                    */}

                    <div className="info-modal-data__costs">
                        <div className="info-modal-data__label">
                            Annual Miles:
                        </div>
                        <div className="info-modal-data__amount">
                            {this.showWhenPricingIsLoaded(() =>
                                this.props.dealPricing.leaseAnnualMileage()
                            )}
                        </div>
                    </div>
                    <div className="info-modal-data__costs info-modal-data__costs--final-payments">
                        <div className="info-modal-data__label">
                            Monthly Payments:
                        </div>
                        <div className="info-modal-data__amount">
                            {this.showWhenPricingIsLoaded(() =>
                                this.props.dealPricing.finalPrice()
                            )}*
                        </div>
                    </div>
                </div>
            );
        }
    }

    render() {
        if (
            this.props.dealPricing.isPricingAvailable() &&
            this.props.dealPricing.isLease() &&
            this.props.dealPricing.cannotPurchase()
        ) {
            // Pricing is completely and we do not have any lease terms. This means that we cannot
            // calculate lease pricing at all.
            return (
                <div>
                    <div className="info-modal-data">
                        <div className="info-modal-data__price">
                            {this.props.withPricingHeader && (
                                <p className="info-modal-data__pricing-details">
                                    Pricing
                                </p>
                            )}

                            {this.props.withPricingTabs && this.renderTabs()}

                            <div className="cash-finance-lease-calculator__calculator-content">
                                <h4>
                                    Currently there are no competitive lease
                                    rates available on this vehicle.
                                </h4>
                            </div>
                        </div>
                    </div>
                </div>
            );
        }

        const { dealPricing } = this.props;

        return (
            <div>
                <div className="info-modal-data">
                    <div className="info-modal-data__price">
                        {this.props.withPricingTabs && this.renderTabs()}

                        <div style={{ textAlign: 'left' }}>
                            {this.props.selectedTab === 'cash' && (
                                <div>
                                    <Line>
                                        <Label>MSRP</Label>
                                        <Value>{dealPricing.msrp()}</Value>
                                    </Line>
                                    <Line>
                                        <Label>Discount</Label>
                                        <Value isNegative={true}>
                                            {dealPricing.discount()}
                                        </Value>
                                    </Line>
                                    <Line>
                                        <Label>Selling Price</Label>
                                        <Value>
                                            {dealPricing.baseSellingPrice()}
                                        </Value>
                                    </Line>
                                    <Line isImportant={true}>
                                        <Label>Cash Price</Label>
                                        <Value>{dealPricing.yourPrice()}</Value>
                                    </Line>
                                    <Line>
                                        <Label>Taxes &amp; Fees</Label>
                                        <Value>
                                            {dealPricing.taxesAndFeesTotal()}
                                        </Value>
                                    </Line>
                                </div>
                            )}

                            {this.props.selectedTab === 'finance' && (
                                <div>
                                    <Line>
                                        <Label>Total Price</Label>
                                        <Value>
                                            {dealPricing.yourPrice()}*
                                        </Value>
                                    </Line>
                                    <Line isSemiImportant={true}>
                                        <Label>Down Payment</Label>
                                        <Value>
                                            {dealPricing.financeDownPayment()}
                                        </Value>
                                    </Line>
                                    <Line>
                                        <Label>Amount Financed</Label>
                                        <Value>
                                            {dealPricing.amountFinanced()}
                                        </Value>
                                    </Line>
                                    <Line>
                                        <Label>Term Length</Label>
                                        <Value>
                                            {dealPricing.financeTerm()} months
                                        </Value>
                                    </Line>
                                    <Line isImportant={true}>
                                        <Label>Monthly Payment</Label>
                                        <Value>
                                            {dealPricing.monthlyPayments()}*
                                        </Value>
                                    </Line>
                                </div>
                            )}

                            {this.props.selectedTab === 'lease' && (
                                <div>
                                    <Line>
                                        <Label>Annual Miles</Label>
                                        <Value>
                                            {dealPricing.leaseAnnualMileage()}
                                        </Value>
                                    </Line>
                                    <Line isSemiImportant={true}>
                                        <Label>Cash Due</Label>
                                        <Value>
                                            {dealPricing.leaseCashDue()}
                                        </Value>
                                    </Line>
                                    <Line>
                                        <Label>Term Length</Label>
                                        <Value>
                                            {dealPricing.leaseTerm()} months
                                        </Value>
                                    </Line>
                                    <Line isImportant={true}>
                                        <Label>Monthly Payment</Label>
                                        <Value>
                                            {dealPricing.monthlyPayments()}*
                                        </Value>
                                    </Line>
                                </div>
                            )}
                        </div>

                        <div className="deal__buttons">
                            {this.props.withCustomizeQuoteOrBuyNow && (
                                <CustomizeQuoteOrBuyNowButton
                                    onCustomizeQuote={() => this.selectDeal()}
                                    deal={this.props.dealPricing.deal()}
                                    hasCustomizedQuote={this.props.dealPricing.hasCustomizedQuote()}
                                    disabled={
                                        !this.props.dealPricing.canPurchase()
                                    }
                                />
                            )}
                        </div>

                        {this.props.selectedTab !== 'cash' && (
                            <Line>
                                <div
                                    style={{
                                        fontStyle: 'italic',
                                        fontSize: '.75em',
                                        marginLeft: '.25em',
                                    }}
                                >
                                    * includes rebates and all taxes and fees
                                </div>
                            </Line>
                        )}
                    </div>

                    {this.props.children}
                </div>
            </div>
        );
    }

    isAlreadyInCompareList() {
        return R.contains(
            this.props.dealPricing.deal(),
            R.map(R.prop('deal'), this.props.compareList)
        );
    }

    compareButtonClass() {
        return (
            'deal__button deal__button--small deal__button--blue' +
            (this.isAlreadyInCompareList() ? 'deal__button--blue' : '')
        );
    }

    backToDetailsButtonClass() {
        return 'deal__button deal__button--small deal__button--small--as-link deal__button--no-border';
    }

    selectDeal() {
        if (this.props.closeModal) {
            this.props.closeModal();
        }

        window.location = '/deals/' + this.props.dealPricing.id();
    }
}

export default InfoModalData;
