import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { dealType } from 'types';
import Loading from 'icons/miscicons/Loading';

import DealPriceExplanationModal from './DealPriceExplanationModal';
import { dealPricingFactory } from 'src/DealPricing';

import { selectDeal } from 'apps/common/actions';

import InformationOutline from 'icons/zondicons/InformationOutline';

class DealPrice extends React.Component {
    static propTypes = {
        deal: dealType.isRequired,
        purchaseStrategy: PropTypes.string.isRequired,
        infoModalIsShowingFor: PropTypes.number,
        onSelectDeal: PropTypes.func.isRequired,
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
                selectDeal={this.props.onSelectDeal}
            />
        );
    }

    showWhenPricingIsLoaded() {
        if (this.props.dealPricing.isPricingLoading()) {
            return <Loading />;
        }

        if (this.props.dealPricing.cannotPurchase()) {
            return <span>N/A</span>;
        }

        return this.props.dealPricing.finalPrice();
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
                        <div className="deal-price__finance-lease-label">
                            {this.getLabel()}
                        </div>
                        <div className="deal-price__finance-lease-price">
                            {this.showWhenPricingIsLoaded()}{' '}
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

const mapDispatchToProps = dispatch => {
    return {
        onSelectDeal: deal => {
            return dispatch(selectDeal(deal));
        },
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(DealPrice);
