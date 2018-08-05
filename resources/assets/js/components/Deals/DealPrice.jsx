import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { dealType } from 'types';
import Loading from 'icons/miscicons/Loading';

import DealPriceExplanationModal from './DealPriceExplanationModal';
import { dealPricingFactory } from 'src/DealPricing';

import InformationOutline from 'icons/zondicons/InformationOutline';

class DealPrice extends React.Component {
    static propTypes = {
        deal: dealType.isRequired,
        purchaseStrategy: PropTypes.string.isRequired,
    };

    state = {
        explanationModalOpen: false,
    };

    toggleExplanationModal() {
        this.setState({
            explanationModalOpen: !this.state.explanationModalOpen,
        });
    }

    renderPriceExplanationModal() {
        if (!this.state.explanationModalOpen) {
            return false;
        }
        return (
            <DealPriceExplanationModal
                isOpen={this.state.explanationModalOpen}
                toggle={this.toggleExplanationModal.bind(this)}
                key={this.props.deal.id}
                deal={this.props.deal}
                purchaseStrategy={this.props.purchaseStrategy}
                dealPricing={this.props.dealPricing}
            />
        );
    }

    showWhenPricingIsLoaded() {
        if (this.props.dealPricing.isPricingLoading()) {
            return <Loading />;
        }

        if (this.props.dealPricing.cannotPurchase()) {
            return (
                <p className="no-lease-rates-error">
                    Sorry, there are currently no lease rates available for this
                    vehicle.
                </p>
            );
        }

        return (
            <div>
                <div className="deal-price__finance-lease-label">
                    {this.getLabel()}
                </div>
                <div className="deal-price__finance-lease-price">
                    {this.props.dealPricing.finalPrice()}{' '}
                    <InformationOutline
                        className="pricing-explanation-open"
                        onClick={() => this.toggleExplanationModal()}
                        height="15px"
                        width="15px"
                        fill="grey"
                    />
                    {this.renderPriceExplanationModal()}
                </div>
                <div className="deal-price__finance-lease-disclaimer">
                    {this.getDisclaimer()}
                </div>
            </div>
        );
    }

    getLabel() {
        switch (this.props.purchaseStrategy) {
            case 'cash':
                return 'Your cash price';
            case 'finance':
                return 'Monthly Finance Payment';
            case 'lease':
                return 'Monthly Lease Payment';
        }
    }

    getDisclaimer() {
        switch (this.props.purchaseStrategy) {
            case 'cash':
                return 'Additional Taxes and Fees Apply';
            case 'finance':
            case 'lease':
                return 'Includes All Taxes and Fees';
        }
    }

    render() {
        return (
            <div className="deal-price">
                <div className="tabs__content">
                    <div className="deal-price__price">
                        {this.showWhenPricingIsLoaded()}
                        <div className="deal-price__hr" />
                        <div className="deal-price__cash-msrp">
                            {this.props.dealPricing.msrp()}{' '}
                            <span className="deal-price__cash-msrp-label">
                                MSRP
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state, props) => {
    return {
        purchaseStrategy: state.user.purchasePreferences.strategy,
        dealPricing: dealPricingFactory(state, props),
    };
};

export default connect(mapStateToProps)(DealPrice);
