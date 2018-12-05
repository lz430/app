import React from 'react';
import PropTypes from 'prop-types';
import { pricingType, dealType } from '../../../core/types';
import classNames from 'classnames';
import { Button } from 'reactstrap';

import config from '../../../core/config';
import Loading from '../../../components/Loading';

import MSRPAndDiscount from './pricing/MSRPAndDiscount';
import TradeIn from './pricing/TradeIn';

import PaymentCash from './pricing/PaymentCash';
import PaymentFinance from './pricing/PaymentFinance';
import PaymentLease from './pricing/PaymentLease';
import PaymentStrategySelect from './pricing/PaymentStrategySelect';
import Rebates from './pricing/Rebates';
import TaxesAndFees from './pricing/TaxesAndFees';
import DetailsLeaseDueAtDeliveryFees from './pricing/DetailsLeaseDueAtDeliveryFees';
import DetailsSummary from './pricing/DetailsSummary';
import DetailsPrice from './pricing/DetailsPrice';
import Line from '../../../apps/pricing/components/Line';
import Label from '../../../apps/pricing/components/Label';
import Value from '../../../apps/pricing/components/Value';
import DollarsAndCents from '../../../components/money/DollarsAndCents';
import Separator from '../../../apps/pricing/components/Separator';
import Group from '../../../apps/pricing/components/Group';

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
                    <Loading size={1} /> Loading, please wait.
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

        return (
            <React.Fragment>
                <div className="cart__cta">{this.renderCtaButton()}</div>
            </React.Fragment>
        );
    }

    renderPane() {
        const { purchaseStrategy, pricing } = this.props;

        if (pricing.quoteIsLoading()) {
            return (
                <div className="m-2">
                    <Loading size={4} />
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
                    onChange={this.props.handleLeaseChange}
                />
            );
        }
    }

    renderProgress() {
        return (
            <div className="steps border border-medium border-bottom-0">
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

                {config['REACT_APP_ENVIRONMENT'] === 'local' && (
                    <TradeIn
                        onCompleteTradeIn={this.props.tradeSet}
                        zipcode={this.props.userLocation.zipcode}
                        pricing={pricing}
                    />
                )}
            </React.Fragment>
        );
    }

    renderPaymentStep() {
        const { pricing, purchaseStrategy } = this.props;

        return (
            <React.Fragment>
                <PaymentStrategySelect
                    {...{ purchaseStrategy }}
                    onChange={this.props.handlePaymentTypeChange}
                />
                {this.renderPane()}
                <Separator showIf={pricing.hasPotentialConditionalRebates()} />
                <Rebates
                    pricing={pricing}
                    onChange={this.props.handleRebatesChange}
                />
            </React.Fragment>
        );
    }

    renderDetailsStep() {
        const { pricing, purchaseStrategy } = this.props;

        if (purchaseStrategy === 'cash') {
            return (
                <React.Fragment>
                    <DetailsSummary
                        pricing={pricing}
                        purchaseStrategy={purchaseStrategy}
                    />
                    <DetailsPrice
                        pricing={pricing}
                        purchaseStrategy={purchaseStrategy}
                    />

                    <TaxesAndFees pricing={pricing} />
                    <Line isImportant>
                        <Label>Total Selling Price</Label>
                        <Value>
                            <DollarsAndCents value={pricing.totalPrice()} />
                        </Value>
                    </Line>
                </React.Fragment>
            );
        }

        if (purchaseStrategy === 'finance') {
            return (
                <React.Fragment>
                    <DetailsSummary
                        pricing={pricing}
                        purchaseStrategy={purchaseStrategy}
                    />
                    <DetailsPrice
                        pricing={pricing}
                        purchaseStrategy={purchaseStrategy}
                    />
                    <TaxesAndFees pricing={pricing} />
                    <Group>
                        <Line>
                            <Label>Final Price</Label>
                            <Value>
                                <DollarsAndCents value={pricing.yourPrice()} />
                            </Value>
                        </Line>
                        <Line>
                            <Label>Down Payment</Label>
                            <Value>
                                <DollarsAndCents
                                    value={pricing.downPayment()}
                                />
                            </Value>
                        </Line>
                        <Line isImportant>
                            <Label>Total Financed Amount</Label>
                            <Value>
                                <DollarsAndCents
                                    value={pricing.amountFinanced()}
                                />
                            </Value>
                        </Line>
                    </Group>
                </React.Fragment>
            );
        }

        if (purchaseStrategy === 'lease') {
            return (
                <React.Fragment>
                    <DetailsSummary
                        pricing={pricing}
                        purchaseStrategy={purchaseStrategy}
                    />
                    <DetailsPrice
                        pricing={pricing}
                        purchaseStrategy={purchaseStrategy}
                    />
                    <DetailsLeaseDueAtDeliveryFees pricing={pricing} />
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
                    <div className="p-4 bg-white border border-medium border-top-0">
                        <Loading />
                    </div>
                </div>
            );
        }

        return (
            <div className="cart">
                {this.renderProgress()}

                <div className="p-4 bg-white border border-medium border-top-0">
                    {this.state.step === 0 && this.renderPriceStep()}
                    {this.state.step === 1 && this.renderPaymentStep()}
                    {this.state.step === 2 && this.renderDetailsStep()}
                </div>
                {this.renderCta()}
            </div>
        );
    }
}
