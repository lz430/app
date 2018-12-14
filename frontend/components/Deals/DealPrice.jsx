import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { dealType } from '../../core/types';

import DealPriceExplanationModal from './DealPriceExplanationModal';

import Loading from '../../components/Loading';

import { faInfoCircle } from '@fortawesome/pro-light-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Dollars from '../money/Dollars';
import { pricingFromGeneric } from '../../apps/pricing/selectors';

class DealPrice extends React.Component {
    static propTypes = {
        deal: dealType.isRequired,
        purchaseStrategy: PropTypes.string.isRequired,
        pricing: PropTypes.object,
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
                dealPricing={this.props.pricing}
            />
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
            default:
                return 'Price';
        }
    }

    renderValue() {
        if (this.props.purchaseStrategy === 'cash') {
            return <Dollars value={this.props.pricing.yourPrice()} />;
        }

        return <Dollars value={this.props.pricing.monthlyPayment()} />;
    }

    showWhenPricingIsLoaded() {
        if (this.props.pricing.quoteIsLoading()) {
            return <Loading size={2} />;
        }

        if (!this.props.pricing.canPurchase()) {
            return (
                <p className="price-summary__error">
                    Sorry, there are currently no lease rates available for this
                    vehicle.
                </p>
            );
        }

        return (
            <div>
                <div className="price-summary__price__label">
                    {this.getLabel()}
                </div>
                <div className="price-summary__price__value">
                    {this.renderValue()}{' '}
                    <span className="price-summary__help">
                        <FontAwesomeIcon
                            icon={faInfoCircle}
                            className="pricing-explanation-open"
                            onClick={() => this.toggleExplanationModal()}
                        />
                    </span>
                    {this.renderPriceExplanationModal()}
                </div>
                <div className="price-summary__price__disclaimer">
                    {this.getDisclaimer()}
                </div>
            </div>
        );
    }

    getDisclaimer() {
        switch (this.props.purchaseStrategy) {
            case 'cash':
            case 'finance':
            case 'lease':
                return 'Includes All Taxes and Fees';
            default:
                return 'Your price';
        }
    }

    render() {
        return (
            <div className="price-summary">
                {this.showWhenPricingIsLoaded()}
                <div className="price-summary__hr" />
                <div className="price-summary__msrp">
                    <Dollars value={this.props.pricing.msrp()} />{' '}
                    <span>MSRP</span>
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state, props) => {
    return {
        pricing: pricingFromGeneric(state, props),
    };
};

export default connect(mapStateToProps)(DealPrice);
