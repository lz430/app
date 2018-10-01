import React from 'react';
import PropTypes from 'prop-types';

import Line from 'components/pricing/Line';
import CashPricingPane from './pricing/CashPane';
import FinancePricingPane from './pricing/FinancePane';
import LeasePricingPane from './pricing/LeasePane';
import PaymentTypes from './pricing/PaymentTypes';
import * as R from 'ramda';
import { dealType } from 'types';
import { pricingType } from '../../../types';

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
        pricing: pricingType.isRequired,
    };

    compareListContainsDeal() {
        return R.contains(
            this.props.deal,
            R.map(R.prop('deal'), this.props.compareList)
        );
    }

    compareButtonClass() {
        return (
            'btn ' +
            (this.compareListContainsDeal()
                ? 'btn-outline-primary'
                : 'btn-primary')
        );
    }

    render() {
        const { purchaseStrategy, pricing, deal } = this.props;

        if (deal.status === 'sold') {
            return (
                <div className="deal-details__pricing">
                    <div>
                        <div className="info-modal-data">
                            <div className="info-modal-data__price">
                                <div
                                    style={{
                                        fontSize: '1.25em',
                                        fontWeight: 'bold',
                                    }}
                                >
                                    We're sorry, this vehicle is no longer
                                    available.{' '}
                                    <span
                                        style={{
                                            fontWeight: 'normal',
                                            fontSize: '.9em',
                                        }}
                                    >
                                        <br />
                                        Start a New <a href="/filter">
                                            Search
                                        </a>.
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            );
        } else {
            return (
                <div className="deal-details__pricing">
                    <div>
                        <div className="info-modal-data">
                            <div className="info-modal-data__price">
                                <PaymentTypes
                                    {...{ purchaseStrategy }}
                                    onChange={
                                        this.props.handlePaymentTypeChange
                                    }
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
                                    <button
                                        className={this.compareButtonClass(
                                            deal
                                        )}
                                        onClick={() =>
                                            this.props.onToggleCompare(deal)
                                        }
                                    >
                                        {this.compareListContainsDeal(deal)
                                            ? 'Remove'
                                            : 'Compare'}
                                    </button>

                                    <button
                                        className="btn btn-success"
                                        onClick={this.props.handleBuyNow}
                                        disabled={!pricing.canPurchase()}
                                    >
                                        Buy Now
                                    </button>
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
}
