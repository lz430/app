import R from 'ramda';
import React from 'react';
import CustomizeQuoteOrBuyNowButton from 'components/CustomizeQuoteOrBuyNowButton';
import SVGInline from 'react-svg-inline';
import miscicons from 'miscicons';
import PropTypes from 'prop-types';

// TODO: These components should be moved to a common area if they are used by other
// common components.
import Line from 'pages/deal-detail/components/pricing/Line';
import Label from 'pages/deal-detail/components/pricing/Label';
import Value from 'pages/deal-detail/components/pricing/Value';

class InfoModalData extends React.PureComponent {
    static propTypes = {
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
        infoModalIsShowingFor: PropTypes.number,
        userLocation: PropTypes.object.isRequired,
        purchaseStrategy: PropTypes.string.isRequired,
        onRequestDealQuote: PropTypes.func.isRequired,
        onSetPurchaseStrategy: PropTypes.func.isRequired,
    };

    static defaultProps = {
        withPricingHeader: true,
        withPricingTabs: true,
        withCompareInsteadOfBack: true,
        withFinalSelectionHeader: false,
        withCustomizeQuoteOrBuyNow: true,
        withConfirmPurchase: false,
    };

    handleTabChange(strategy) {
        this.props.onSetPurchaseStrategy(strategy);
        this.props.onRequestDealQuote(
            this.props.deal,
            this.props.userLocation.zipcode,
            strategy
        );
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
                            this.props.purchaseStrategy === 'cash'
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
                            this.props.purchaseStrategy === 'finance'
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
                            this.props.purchaseStrategy === 'lease'
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
                            {this.props.purchaseStrategy === 'cash' && (
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

                            {this.props.purchaseStrategy === 'finance' && (
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

                            {this.props.purchaseStrategy === 'lease' && (
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

                        {this.props.purchaseStrategy !== 'cash' && (
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
