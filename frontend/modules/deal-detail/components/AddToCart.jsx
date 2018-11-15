import React from 'react';
import PropTypes from 'prop-types';
import { pricingType, dealType } from '../../../core/types';

import MSRPAndDiscountPane from './pricing/MSRPAndDiscountPane';
import CashPricingPane from './pricing/CashPane';
import FinancePricingPane from './pricing/FinancePane';
import LeasePricingPane from './pricing/LeasePane';
import PaymentTypes from './pricing/PaymentTypes';
import Loading from '../../../components/Loading';

import { Button } from 'reactstrap';

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
                <Button color="success" block disabled={true}>
                    <Loading /> Loading, please wait.
                </Button>
            );
        }

        return (
            <Button
                color="success"
                block
                onClick={() => this.handleSubmit()}
                disabled={!this.props.pricing.canPurchase()}
            >
                Select Deal
            </Button>
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

        let disclaimer;

        if (purchaseStrategy === 'cash') {
            disclaimer = <div>* includes all taxes and dealer fees</div>;
        } else if (purchaseStrategy === 'finance') {
            disclaimer = (
                <div>
                    * includes all taxes and dealer fees <br />
                    Payment calculated with 5% interest <br />
                    Monthly payment amount applies to qualified credit or lease
                    applicants having a minimum credit score of 740. Your
                    monthly payment is established based on a full review of
                    your credit application and credit report.
                </div>
            );
        } else {
            disclaimer = (
                <div>
                    * includes all taxes and dealer fees <br />
                    Monthly payment amount applies to qualified credit or lease
                    applicants having a minimum credit score of 740. Your
                    monthly payment is established based on a full review of
                    your credit application and credit report.
                </div>
            );
        }

        return (
            <React.Fragment>
                <div className="cart__cta">{this.renderCtaButton()}</div>
                <div className="cart__disclaimer text-sm font-italic p-1 ">
                    {disclaimer}
                </div>
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
        const { purchaseStrategy, deal, pricing } = this.props;

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
            <div className="cart">
                <h5 className="text-center bg-light m-0 p-1 border border-medium border-bottom-0">
                    Configure Your Payment
                </h5>
                <div className="pt-4 pl-4 pr-4 bg-white border border-medium border-top-0">
                    <MSRPAndDiscountPane
                        pricing={pricing}
                        onDiscountChange={this.props.handleDiscountChange}
                        onRebatesChange={this.props.handleRebatesChange}
                        onChange={this.props.handleLeaseChange}
                    />

                    <PaymentTypes
                        {...{ purchaseStrategy }}
                        onChange={this.props.handlePaymentTypeChange}
                    />
                    {this.renderPane()}
                </div>
                {this.renderCta()}
            </div>
        );
    }
}
