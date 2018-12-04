import React from 'react';
import PropTypes from 'prop-types';
import { pricingType, dealType } from '../../../core/types';
import classNames from 'classnames';
import { Button } from 'reactstrap';

import config from '../../../core/config';
import Group from '../../../apps/pricing/components/Group';
import Header from '../../../apps/pricing/components/Header';
import Loading from '../../../components/Loading';

import MSRPAndDiscount from './pricing/MSRPAndDiscount';
import TradeIn from './pricing/TradeIn';

import PaymentCash from './pricing/PaymentCash';
import PaymentFinance from './pricing/PaymentFinance';
import PaymentLease from './pricing/PaymentLease';
import PaymentStrategySelect from './pricing/PaymentStrategySelect';
import Rebates from './pricing/Rebates';
import TaxesAndFees from './pricing/TaxesAndFees';
import DetailLeaseDueAtDeliveryFees from './pricing/DetailLeaseDueAtDeliveryFees';

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
        tradeSet: PropTypes.func.isRequired,
        userLocation: PropTypes.object.isRequired,
        pricing: pricingType.isRequired,
    };

    state = {
        step: 0, // price || payment || detail
        submitted: false,
    };

    steps = [
        {
            label: 'Price',
            cta: (
                <span>
                    <strong>Next:</strong> Configure Payments
                </span>
            ),
        },
        {
            label: 'Payments',
            cta: (
                <span>
                    <strong>Next:</strong> Review Details
                </span>
            ),
        },
        {
            label: 'Details',
            cta: (
                <span>
                    <strong>Next:</strong> Start Purchase
                </span>
            ),
        },
    ];

    handleSubmit() {
        this.setState({ submitted: true });
        this.props.handleBuyNow();
    }

    progressToNextStep() {
        //
        // Progress to the next step
        if (this.state.step < this.steps.length - 1) {
            this.setState({ step: this.state.step + 1 });
        } else {
            this.handleSubmit();
        }
    }

    selectStep(step) {
        if (step >= this.state.step) {
            return false;
        }

        this.setState({ step: step });
    }

    /**
     * Render button depending on if we're submitting or not.
     * @returns {*}
     */
    renderCtaButton() {
        if (!this.props.pricing) {
            return false;
        }

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
                onClick={() => this.progressToNextStep()}
            >
                {this.steps[this.state.step].cta}
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

        if (pricing.quoteIsLoading()) {
            return (
                <div className="m-2">
                    <Loading />
                </div>
            );
        }

        if (purchaseStrategy === 'cash') {
            return (
                <PaymentCash
                    pricing={pricing}
                    onDiscountChange={this.props.handleDiscountChange}
                    onRebatesChange={this.props.handleRebatesChange}
                />
            );
        }

        if (purchaseStrategy === 'finance') {
            return (
                <PaymentFinance
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
                <div className="pb-4">
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
                </div>
            );
        }

        // Lease
        if (purchaseStrategy === 'lease') {
            return (
                <PaymentLease
                    pricing={pricing}
                    onDiscountChange={this.props.handleDiscountChange}
                    onRebatesChange={this.props.handleRebatesChange}
                    onChange={this.props.handleLeaseChange}
                />
            );
        }
    }

    renderProgress() {
        return (
            <div className="steps">
                {this.steps.map((step, index) => {
                    return (
                        <div
                            key={'step' + index}
                            onClick={() => this.selectStep(index)}
                            className={classNames(
                                'step',
                                { complete: this.state.step > index },
                                { disabled: this.state.step < index },
                                { active: this.state.step === index }
                            )}
                        >
                            {step.label}
                        </div>
                    );
                })}
            </div>
        );
    }

    renderPriceStep() {
        const { pricing } = this.props;

        return (
            <React.Fragment>
                <MSRPAndDiscount
                    pricing={pricing}
                    onDiscountChange={this.props.handleDiscountChange}
                    onChange={this.props.handleLeaseChange}
                />

                {config['REACT_APP_ENVIRONMENT'] !== 'production' && (
                    <TradeIn
                        onCompleteTradeIn={this.props.tradeSet}
                        zipcode={this.props.userLocation.zipcode}
                        pricing={pricing}
                    />
                )}

                <Group>
                    <Header>Rebates</Header>
                    <Rebates
                        pricing={pricing}
                        onChange={this.props.handleRebatesChange}
                    />
                </Group>
            </React.Fragment>
        );
    }

    renderPaymentStep() {
        const { purchaseStrategy } = this.props;

        return (
            <React.Fragment>
                <PaymentStrategySelect
                    {...{ purchaseStrategy }}
                    onChange={this.props.handlePaymentTypeChange}
                />
                {this.renderPane()}
            </React.Fragment>
        );
    }

    renderDetailsStep() {
        const { pricing, purchaseStrategy } = this.props;

        if (purchaseStrategy === 'cash') {
            return (
                <React.Fragment>
                    <TaxesAndFees pricing={pricing} />
                </React.Fragment>
            );
        }

        if (purchaseStrategy === 'finance') {
            return (
                <React.Fragment>
                    <TaxesAndFees pricing={pricing} />
                </React.Fragment>
            );
        }

        if (purchaseStrategy === 'lease') {
            return (
                <React.Fragment>
                    <DetailLeaseDueAtDeliveryFees pricing={pricing} />
                </React.Fragment>
            );
        }
        return false;
    }

    render() {
        const { deal, pricing } = this.props;

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

        if (!pricing) {
            return (
                <div className="cart">
                    <h5 className="text-center bg-light m-0 p-1 border border-medium border-bottom-0">
                        Configure Your Payment
                    </h5>
                    <div className="pt-4 pl-4 pr-4 bg-white border border-medium border-top-0">
                        <Loading />
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
                    {this.renderProgress()}
                    {this.state.step === 0 && this.renderPriceStep()}
                    {this.state.step === 1 && this.renderPaymentStep()}
                    {this.state.step === 2 && this.renderDetailsStep()}
                </div>
                {this.renderCta()}
            </div>
        );
    }
}
