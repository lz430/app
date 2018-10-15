import React from 'react';
import PropTypes from 'prop-types';
import { dealType, dealPricingType } from '../../types';

import Line from '../pricing/Line';
import CashPriceExplanation from './CashPriceExplanation';
import FinancePriceExplanation from './FinancePriceExplanation';
import LeasePriceExplanation from './LeasePriceExplanation';
import Link from 'next/link';

class DealPriceExplanationModalData extends React.PureComponent {
    static propTypes = {
        deal: dealType.isRequired,
        dealPricing: dealPricingType.isRequired,
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
                                <CashPriceExplanation
                                    dealPricing={dealPricing}
                                />
                            )}

                            {this.props.purchaseStrategy === 'finance' && (
                                <FinancePriceExplanation
                                    dealPricing={dealPricing}
                                />
                            )}

                            {this.props.purchaseStrategy === 'lease' && (
                                <LeasePriceExplanation
                                    dealPricing={dealPricing}
                                />
                            )}
                        </div>

                        {this.props.purchaseStrategy === 'lease' && (
                            <Line>
                                <div
                                    style={{
                                        fontStyle: 'italic',
                                        fontSize: '.9em',
                                        marginLeft: '.25em',
                                    }}
                                >
                                    * all taxes included
                                </div>
                            </Line>
                        )}

                        <div className="deal__buttons">
                            <Link
                                className="btn btn-primary btn-block"
                                to={
                                    '/deals/' + this.props.dealPricing.deal().id
                                }
                            >
                                View Details
                            </Link>
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
