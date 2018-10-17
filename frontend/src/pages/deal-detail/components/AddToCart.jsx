import React from 'react';
import PropTypes from 'prop-types';

import Line from '../../../components/pricing/Line';
import CashPricingPane from './pricing/CashPane';
import FinancePricingPane from './pricing/FinancePane';
import LeasePricingPane from './pricing/LeasePane';
import PaymentTypes from './pricing/PaymentTypes';
import { pricingType, dealType } from '../../../types';
import Link from 'next/link';
import Loading from '../../../icons/miscicons/Loading';

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

    renderCta() {
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

    render() {
        const { purchaseStrategy, pricing, deal } = this.props;

        if (deal.status === 'sold') {
            return (
                <div className="deal-details__pricing">
                    <div className="info-modal-data">
                        <div
                            style={{
                                fontSize: '1.25em',
                                fontWeight: 'bold',
                            }}
                        >
                            We&apos;re sorry, this vehicle is no longer
                            available.{' '}
                            <span
                                style={{
                                    fontWeight: 'normal',
                                    fontSize: '.9em',
                                }}
                            >
                                <br />
                                Start a New <Link to="/filter">Search</Link>.
                            </span>
                        </div>
                    </div>
                </div>
            );
        }

        if (
            this.props.userLocation.state !== 'MI' &&
            this.props.userLocation.state !== 'OH'
        ) {
            return (
                <div className="deal-details__pricing">
                    <div className="info-modal-data">
                        <div
                            style={{
                                fontSize: '1.25em',
                                fontWeight: 'bold',
                            }}
                        >
                            We&apos;re sorry, this vehicle is not available in
                            your area{' '}
                            <span
                                style={{
                                    fontWeight: 'normal',
                                    fontSize: '.9em',
                                }}
                            >
                                <br />
                                Please contact us at{' '}
                                <a href="tel:855-675-7301">
                                    (855) 675-7301
                                </a>{' '}
                                for more information.
                            </span>
                        </div>
                    </div>
                </div>
            );
        }

        return (
            <div className="deal-details__pricing">
                <div>
                    <div className="info-modal-data">
                        <div className="info-modal-data__price">
                            <PaymentTypes
                                {...{ purchaseStrategy }}
                                onChange={this.props.handlePaymentTypeChange}
                            />
                            {this.props.purchaseStrategy === 'cash' && (
                                <CashPricingPane
                                    pricing={pricing}
                                    onDiscountChange={
                                        this.props.handleDiscountChange
                                    }
                                    onRebatesChange={
                                        this.props.handleRebatesChange
                                    }
                                />
                            )}
                            {this.props.purchaseStrategy === 'finance' && (
                                <FinancePricingPane
                                    pricing={pricing}
                                    onDiscountChange={
                                        this.props.handleDiscountChange
                                    }
                                    onRebatesChange={
                                        this.props.handleRebatesChange
                                    }
                                    onDownPaymentChange={
                                        this.props
                                            .handleFinanceDownPaymentChange
                                    }
                                    onTermChange={
                                        this.props.handleFinanceTermChange
                                    }
                                />
                            )}
                            {this.props.purchaseStrategy === 'lease' && (
                                <LeasePricingPane
                                    pricing={pricing}
                                    onDiscountChange={
                                        this.props.handleDiscountChange
                                    }
                                    onRebatesChange={
                                        this.props.handleRebatesChange
                                    }
                                    onChange={this.props.handleLeaseChange}
                                />
                            )}
                            <div className="deal__buttons">
                                {this.renderCta()}
                            </div>
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
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
