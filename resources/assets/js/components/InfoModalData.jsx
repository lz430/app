import R from 'ramda';
import React from 'react';
import CustomizeQuoteOrBuyNowButton from 'components/CustomizeQuoteOrBuyNowButton';
import strings from 'src/strings';
import SVGInline from 'react-svg-inline';
import miscicons from 'miscicons';

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

                        {this.props.withFinalSelectionHeader && (
                            <div className="info-modal-data__final-selection-header">
                                <div className="info-modal-data__final-selection-header__you-selected">
                                    You selected
                                </div>
                                <div className="info-modal-data__final-selection-header__year-make-model-trim">
                                    {strings.dealYearMake(
                                        this.props.dealPricing.deal()
                                    )}{' '}
                                    {strings.dealModelTrim(
                                        this.props.dealPricing.deal()
                                    )}
                                </div>
                                <div className="info-modal-data__final-selection-header__stock-number">
                                    Stock #{
                                        this.props.dealPricing.deal()
                                            .stock_number
                                    }
                                </div>
                                <hr />
                                <div className="info-modal-data__final-selection-header__payment-option">
                                    {strings.toTitleCase(
                                        this.props.selectedTab
                                    )}{' '}
                                    Option
                                </div>
                            </div>
                        )}

                        <div className="info-modal-data__prices">
                            <div className="info-modal-data__costs">
                                <div className="info-modal-data__label">
                                    MSRP:{' '}
                                </div>
                                <div className="info-modal-data__amount">
                                    {this.props.dealPricing.msrp()}
                                </div>
                            </div>
                            <div className="info-modal-data__costs">
                                <div className="info-modal-data__label">
                                    Selling Price:
                                </div>
                                <div className="info-modal-data__amount">
                                    {this.showWhenPricingIsLoaded(() =>
                                        this.props.dealPricing.sellingPrice()
                                    )}
                                </div>
                            </div>

                            {this.renderAppliedRebatesLink()}

                            <div className="info-modal-data__costs info-modal-data__costs--final">
                                <div className="info-modal-data__label">
                                    Your Price:
                                </div>
                                {this.props.selectedTab === 'cash' && (
                                    <div className="info-modal-data__amount info-modal-data__amount--cash">
                                        {this.showWhenPricingIsLoaded(() =>
                                            this.props.dealPricing.yourPrice()
                                        )}*
                                    </div>
                                )}
                                {this.props.selectedTab === 'finance' && (
                                    <div className="info-modal-data__amount info-modal-data__amount--finance">
                                        {this.showWhenPricingIsLoaded(() =>
                                            this.props.dealPricing.yourPrice()
                                        )}*
                                    </div>
                                )}
                                {this.props.selectedTab === 'lease' && (
                                    <div className="info-modal-data__amount info-modal-data__amount--lease">
                                        {this.showWhenPricingIsLoaded(() =>
                                            this.props.dealPricing.yourPrice()
                                        )}*
                                    </div>
                                )}
                            </div>

                            {this.props.selectedTab !== 'cash' && (
                                <div>
                                    <hr />
                                    <div>{this.renderPaymentDefaults()}</div>
                                </div>
                            )}
                        </div>
                        <hr />

                        {!this.props.withConfirmPurchase && (
                            <div className="info-modal-data__more-rebates info-modal-data__costs">
                                <div>
                                    Additional rebates may apply.{' '}
                                    <a
                                        onClick={this.handleGetRebatesLink.bind(
                                            this
                                        )}
                                        className="link"
                                    >
                                        See more
                                    </a>
                                </div>
                            </div>
                        )}

                        <div className="deal__buttons">
                            {this.props.withCompareInsteadOfBack && (
                                <button
                                    className={this.compareButtonClass()}
                                    onClick={this.props.toggleCompare.bind(
                                        null,
                                        this.props.dealPricing.deal()
                                    )}
                                >
                                    {this.isAlreadyInCompareList()
                                        ? 'Remove from compare'
                                        : 'Compare'}
                                </button>
                            )}
                            {!this.props.withCompareInsteadOfBack && (
                                <button
                                    className={this.backToDetailsButtonClass()}
                                    onClick={() =>
                                        (window.location = `/deals/${
                                            this.props.dealPricing.deal().id
                                        }`)
                                    }
                                >
                                    Back to details
                                </button>
                            )}
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
                            {this.props.withConfirmPurchase && (
                                <button
                                    className="deal__button deal__button--small deal__button--pink deal__button"
                                    onClick={this.props.onConfirmPurchase}
                                    disabled={
                                        !this.props.dealPricing.canPurchase()
                                    }
                                >
                                    Confirm purchase
                                </button>
                            )}
                        </div>
                        <div className="accupricing-cta">
                            <a onClick={this.props.showAccuPricingModal}>
                                <img
                                    src="/images/accupricing-logo.png"
                                    className="accupricing-cta__logo"
                                />
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

        this.props.selectDeal(this.props.dealPricing.deal());
    }
}

export default InfoModalData;
