import React from 'react';
import PropTypes from 'prop-types';
import { dealType } from 'types';

import CustomizeQuoteOrBuyNowButton from 'components/CustomizeQuoteOrBuyNowButton';
import Group from '../pricing/Group';
import Line from '../pricing/Line';
import Label from '../pricing/Label';
import Value from '../pricing/Value';

class DealPriceExplanationModalData extends React.PureComponent {
    static propTypes = {
        deal: dealType.isRequired,
        purchaseStrategy: PropTypes.string.isRequired,
        closeModal: PropTypes.func,
        children: PropTypes.node,
    };

    static defaultProps = {
        withPricingHeader: true,
    };

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
                            <CustomizeQuoteOrBuyNowButton
                                onCustomizeQuote={() => this.selectDeal()}
                                deal={this.props.dealPricing.deal()}
                                hasCustomizedQuote={false}
                                disabled={!this.props.dealPricing.canPurchase()}
                            />
                        </div>
                    </div>
                    {this.props.children}
                </div>
            </div>
        );
    }

    selectDeal() {
        if (this.props.closeModal) {
            this.props.closeModal();
        }

        window.location = '/deals/' + this.props.dealPricing.id();
    }
}

export default DealPriceExplanationModalData;