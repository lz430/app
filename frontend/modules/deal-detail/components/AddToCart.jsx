import React from 'react';
import PropTypes from 'prop-types';
import { pricingType, dealType } from '../../../core/types';

import Line from '../../../components/pricing/Line';
import CashPricingPane from './pricing/CashPane';
import FinancePricingPane from './pricing/FinancePane';
import LeasePricingPane from './pricing/LeasePane';
import PaymentTypes from './pricing/PaymentTypes';
import Loading from '../../../components/Loading';

export default class AddToCart extends React.PureComponent {
    static propTypes = {
        deal: dealType.isRequired,
        purchaseStrategy: PropTypes.string.isRequired,
        handlePaymentTypeChange: PropTypes.func.isRequired,
        handleDiscountChange: PropTypes.func.isRequired,
        handleRebatesChange: PropTypes.func.isRequired,
        handleFinanceDownPaymentChange: PropTypes.func.isRequired,
        handleFinanceTermChange: PropTypes.func.isRequired,
        handleLeaseChange: PropTypes.func.isRequired,
        handleBuyNow: PropTypes.func.isRequired,
        onToggleCompare: PropTypes.func.isRequired,
        compareList: PropTypes.array,
        userLocation: PropTypes.object.isRequired,
        pricing: pricingType.isRequired,
    };

    state = {
        submitted: false,
    };

    handleSubmit() {
        this.setState({ submitted: true });
        this.props.handleBuyNow();
    }

    /**
     * Render button depending on if we're submitting or not.
     * @returns {*}
     */
    renderCtaButton() {
        if (this.state.submitted) {
            return (
                <button className="btn btn-success" disabled={true}>
                    <Loading /> Loading, please wait.
                </button>
            );
        }

        return (
            <button
                className="btn btn-success"
                onClick={() => this.handleSubmit()}
                disabled={!this.props.pricing.canPurchase()}
            >
                Select Deal
            </button>
        );
    }

    /**
     * Lease has some custom logic... We don't show the CTA for invalid leases.
     * @returns {*}
     */
    renderCta() {
        const { purchaseStrategy, pricing } = this.props;

        if (
            purchaseStrategy === 'lease' &&
            pricing.quoteIsLoaded() &&
            (!pricing.annualMileageAvailable() ||
                !pricing.annualMileageAvailable().length)
        ) {
            return false;
        }

        return (
            <React.Fragment>
                <div className="deal__buttons">{this.renderCtaButton()}</div>
                <Line>
                    <div
                        style={{
                            fontStyle: 'italic',
                            fontSize: '1em',
                            marginLeft: '.25em',
                        }}
                    >
                        * includes all taxes and dealer fees
                    </div>
                </Line>
            </React.Fragment>
        );
    }

    renderPane() {
        const { purchaseStrategy, pricing } = this.props;

        if (purchaseStrategy === 'cash') {
            return (
                <CashPricingPane
                    pricing={pricing}
                    onDiscountChange={this.props.handleDiscountChange}
                    onRebatesChange={this.props.handleRebatesChange}
                />
            );
        }

        if (purchaseStrategy === 'finance') {
            return (
                <FinancePricingPane
                    pricing={pricing}
                    onDiscountChange={this.props.handleDiscountChange}
                    onRebatesChange={this.props.handleRebatesChange}
                    onDownPaymentChange={
                        this.props.handleFinanceDownPaymentChange
                    }
                    onTermChange={this.props.handleFinanceTermChange}
                />
            );
        }

        //
        // Lease Error
        if (
            purchaseStrategy === 'lease' &&
            pricing.quoteIsLoaded() &&
            (!pricing.annualMileageAvailable() ||
                !pricing.annualMileageAvailable().length)
        ) {
            return (
                <React.Fragment>
                    <div className="mb-2 mt-2 text-center">
                        We&apos;re sorry, there are no incentivized lease rates
                        for this vehicle.
                        <br />
                        <br />
                        However, you may still be able to lease this vehicle.
                        Please contact us for more information.
                    </div>
                    <hr />
                    <div className="text-sm text-center border border-warning p-2 font-weight-bold">
                        Please contact us at{' '}
                        <a href="tel:855-675-7301">(855) 675-7301</a> for more
                        information.
                    </div>
                </React.Fragment>
            );
        }

        // Lease
        if (purchaseStrategy === 'lease') {
            return (
                <LeasePricingPane
                    pricing={pricing}
                    onDiscountChange={this.props.handleDiscountChange}
                    onRebatesChange={this.props.handleRebatesChange}
                    onChange={this.props.handleLeaseChange}
                />
            );
        }
    }

    render() {
        const { purchaseStrategy, deal } = this.props;

        if (deal.status === 'sold') {
            return (
                <div className="bg-white border border-medium p-4">
                    <div className="mb-2">
                        We&apos;re sorry, this vehicle is no longer available.
                    </div>
                    <hr />
                    <div className="text-sm text-center border border-warning p-2 font-weight-bold">
                        Please contact us at{' '}
                        <a href="tel:855-675-7301">(855) 675-7301</a> for more
                        information.
                    </div>
                </div>
            );
        }

        if (this.props.userLocation.state !== 'MI') {
            return (
                <div className="bg-white border border-medium p-4">
                    <div className="mb-2">
                        We&apos;re sorry, this vehicle is not available in your
                        area.
                    </div>
                    <div>
                        We are currently only delivering vehicles within the
                        state of Michigan.
                    </div>
                    <hr />
                    <div className="text-sm text-center border border-warning p-2 font-weight-bold">
                        Please contact us at{' '}
                        <a href="tel:855-675-7301">(855) 675-7301</a> for more
                        information.
                    </div>
                </div>
            );
        }

        return (
            <div className="deal-details__pricing bg-white border border-medium p-4">
                <PaymentTypes
                    {...{ purchaseStrategy }}
                    onChange={this.props.handlePaymentTypeChange}
                />
                {this.renderPane()}
                {this.renderCta()}
            </div>
        );
    }
}
