import R from 'ramda';
import React from 'react';
import CustomizeQuoteOrBuyNowButton from 'components/CustomizeQuoteOrBuyNowButton';
import SVGInline from 'react-svg-inline';
import miscicons from 'miscicons';
import PropTypes from 'prop-types';
import Group from './pricing/Group';
import Line from './pricing/Line';
import Label from './pricing/Label';
import Value from './pricing/Value';

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
        withCustomizeQuoteOrBuyNow: PropTypes.bool,
        withConfirmPurchase: PropTypes.bool,
        infoModalIsShowingFor: PropTypes.number,
        userLocation: PropTypes.object.isRequired,
        purchaseStrategy: PropTypes.string.isRequired,
        onRequestDealQuote: PropTypes.func.isRequired,
        onConfirmPurchase: PropTypes.func,
        onSetPurchaseStrategy: PropTypes.func.isRequired,
        closeModal: PropTypes.func,
        children: PropTypes.node,
        withPricingTabs: PropTypes.bool,
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
                                    <Group>
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
                                        <Line isSectionTotal={true}>
                                            <Label>Discounted Price</Label>
                                            <Value is>
                                                {dealPricing.discountedPrice()}
                                            </Value>
                                        </Line>
                                    </Group>
                                    <Group>
                                        <Line>
                                            <Label>Rebates Applied</Label>
                                            <Value
                                                isNegative={true}
                                                isLoading={dealPricing.dealQuoteIsLoading()}
                                            >
                                                {dealPricing.bestOffer()}
                                            </Value>
                                        </Line>
                                        <Line
                                            isImportant={true}
                                            isSectionTotal={true}
                                        >
                                            <Label>Cash Price</Label>
                                            <Value
                                                isLoading={dealPricing.dealQuoteIsLoading()}
                                            >
                                                {dealPricing.cashPrice()}
                                            </Value>
                                        </Line>
                                        <Line>
                                            <Label>Taxes &amp; Fees</Label>
                                            <Value
                                                isLoading={dealPricing.dealQuoteIsLoading()}
                                            >
                                                {dealPricing.taxesAndFeesTotal()}
                                            </Value>
                                        </Line>
                                    </Group>
                                </div>
                            )}

                            {this.props.purchaseStrategy === 'finance' && (
                                <div>
                                    <Group>
                                        <Line>
                                            <Label>Total Selling Price</Label>
                                            <Value
                                                isLoading={dealPricing.dealQuoteIsLoading()}
                                            >
                                                {dealPricing.yourPrice()}*
                                            </Value>
                                        </Line>
                                        <Line isSemiImportant={true}>
                                            <Label>Down Payment</Label>
                                            <Value
                                                isLoading={dealPricing.dealQuoteIsLoading()}
                                            >
                                                {dealPricing.financeDownPayment()}
                                            </Value>
                                        </Line>
                                        <Line>
                                            <Label>Amount Financed</Label>
                                            <Value
                                                isLoading={dealPricing.dealQuoteIsLoading()}
                                            >
                                                {dealPricing.amountFinanced()}
                                            </Value>
                                        </Line>
                                        <Line>
                                            <Label>Term</Label>
                                            <Value>
                                                {dealPricing.financeTerm()}{' '}
                                                months
                                            </Value>
                                        </Line>
                                        <Line isImportant={true}>
                                            <Label>Monthly Payment</Label>
                                            <Value
                                                isLoading={dealPricing.dealQuoteIsLoading()}
                                            >
                                                {dealPricing.monthlyPayments()}*
                                            </Value>
                                        </Line>
                                    </Group>
                                </div>
                            )}

                            {this.props.purchaseStrategy === 'lease' && (
                                <div>
                                    <Group>
                                        <Line>
                                            <Label>Annual Miles</Label>
                                            <Value
                                                isLoading={dealPricing.dealQuoteIsLoading()}
                                            >
                                                {dealPricing.leaseAnnualMileage()}
                                            </Value>
                                        </Line>
                                        <Line>
                                            <Label>Term</Label>
                                            <Value
                                                isLoading={dealPricing.dealQuoteIsLoading()}
                                            >
                                                {dealPricing.leaseTerm()} months
                                            </Value>
                                        </Line>
                                        <Line isImportant={true}>
                                            <Label>Monthly Payment</Label>
                                            <Value
                                                isLoading={dealPricing.dealQuoteIsLoading()}
                                            >
                                                {dealPricing.monthlyPayments()}*
                                            </Value>
                                        </Line>
                                    </Group>
                                </div>
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

                        <div className="deal__buttons">
                            {this.props.withCustomizeQuoteOrBuyNow && (
                                <CustomizeQuoteOrBuyNowButton
                                    onCustomizeQuote={() => this.selectDeal()}
                                    deal={this.props.dealPricing.deal()}
                                    hasCustomizedQuote={false}
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
