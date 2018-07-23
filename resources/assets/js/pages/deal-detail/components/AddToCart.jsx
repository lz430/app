import React from 'react';
import PropTypes from 'prop-types';

import Line from 'components/pricing/Line';
import CashPricingPane from './pricing/CashPane';
import FinancePricingPane from './pricing/FinancePane';
import LeasePricingPane from './pricing/LeasePane';
import PaymentTypes from './pricing/PaymentTypes';
import R from 'ramda';
import { dealType } from 'types';

export default class AddToCart extends React.PureComponent {
    static propTypes = {
        deal: dealType.isRequired,
        dealPricing: PropTypes.object,
        purchaseStrategy: PropTypes.string.isRequired,
        handlePaymentTypeChange: PropTypes.func.isRequired,
        handleDiscountChange: PropTypes.func.isRequired,
        handleRebatesChange: PropTypes.func.isRequired,
        handleFinanceDownPaymentChange: PropTypes.func.isRequired,
        handleFinanceTermChange: PropTypes.func.isRequired,
        handleLeaseTermChange: PropTypes.func.isRequired,
        handleLeaseCashDueChange: PropTypes.func.isRequired,
        handleLeaseAnnualMileageChange: PropTypes.func.isRequired,
        handleLeaseChange: PropTypes.func.isRequired,
        handleBuyNow: PropTypes.func.isRequired,
        onToggleCompare: PropTypes.func.isRequired,
        compareList: PropTypes.array,
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
        const { purchaseStrategy, dealPricing, deal } = this.props;

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
                                    {...{ dealPricing }}
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
                                    {...{ dealPricing }}
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
                                    {...{ dealPricing }}
                                    onDiscountChange={
                                        this.props.handleDiscountChange
                                    }
                                    onRebatesChange={
                                        this.props.handleRebatesChange
                                    }
                                    onTermChange={
                                        this.props.handleLeaseTermChange
                                    }
                                    onAnnualMileageChange={
                                        this.props
                                            .handleLeaseAnnualMileageChange
                                    }
                                    onCashDueChange={
                                        this.props.handleLeaseCashDueChange
                                    }
                                    onChange={this.props.handleLeaseChange}
                                />
                            )}
                            <div className="deal__buttons">
                                <button
                                    className={this.compareButtonClass(deal)}
                                    onClick={() =>
                                        this.props.onToggleCompare(
                                            this.props.dealPricing.deal()
                                        )
                                    }
                                >
                                    {this.compareListContainsDeal(deal)
                                        ? 'Remove'
                                        : 'Compare'}
                                </button>

                                <button
                                    className="btn btn-success"
                                    onClick={this.props.handleBuyNow}
                                    disabled={
                                        !this.props.dealPricing.canPurchase()
                                    }
                                >
                                    Buy Now
                                </button>
                            </div>
                            <Line>
                                <div
                                    style={{
                                        fontStyle: 'italic',
                                        fontSize: '.75em',
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
