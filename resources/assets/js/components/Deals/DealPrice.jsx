import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import SVGInline from 'react-svg-inline';
import miscicons from 'miscicons';
import InfoModal from 'components/InfoModal';
import { dealPricingFactory } from 'src/DealPricing';

import {
    selectDeal,
    toggleCompare,
    showInfoModal,
    hideInfoModal,
} from 'apps/common/actions';

import { setPurchaseStrategy } from 'apps/user/actions';
import { requestDealQuote } from 'apps/pricing/actions';
import { getUserLocation } from 'apps/user/selectors';

class DealPrice extends React.Component {
    static propTypes = {
        deal: PropTypes.object.isRequired,
        purchaseStrategy: PropTypes.string.isRequired,
        userLocation: PropTypes.object.isRequired,
        compareList: PropTypes.array.isRequired,
        infoModalIsShowingFor: PropTypes.number,
        onSelectDeal: PropTypes.func.isRequired,
        onSetPurchaseStrategy: PropTypes.func.isRequired,
        onToggleCompare: PropTypes.func.isRequired,
        onShowInfoModal: PropTypes.func.isRequired,
        onHideInfoModal: PropTypes.func.isRequired,
        onRequestDealQuote: PropTypes.func.isRequired,
    };

    renderPriceExplanationModal() {
        return (
            <InfoModal
                key={this.props.deal.id}
                deal={this.props.deal}
                userLocation={this.props.userLocation}
                purchaseStrategy={this.props.purchaseStrategy}
                onSetPurchaseStrategy={this.props.onSetPurchaseStrategy}
                onRequestDealQuote={this.props.onRequestDealQuote}
                dealPricing={this.props.dealPricing}
                compareList={this.props.compareList}
                selectDeal={this.props.onSelectDeal}
                toggleCompare={this.props.onToggleCompare}
                showInfoModal={this.props.onShowInfoModal}
                hideInfoModal={this.props.onHideInfoModal}
                infoModalIsShowingFor={this.props.infoModalIsShowingFor}
                withPricingTabs={false}
            />
        );
    }

    showWhenPricingIsLoaded() {
        if (this.props.dealPricing.isPricingLoading()) {
            return <SVGInline svg={miscicons['loading']} />;
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
                return 'Estimated Monthly Lease Payment';
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
                            {this.showWhenPricingIsLoaded()}
                            {this.renderPriceExplanationModal()}
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
        userLocation: getUserLocation(state),
        purchaseStrategy: state.user.purchasePreferences.strategy,
        dealPricing: dealPricingFactory(state, props),
        compareList: state.common.compareList,
        infoModalIsShowingFor: state.common.infoModalIsShowingFor,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        onSelectDeal: deal => {
            return dispatch(selectDeal(deal));
        },
        onSetPurchaseStrategy: strategy => {
            return dispatch(setPurchaseStrategy(strategy));
        },
        onToggleCompare: deal => {
            return dispatch(toggleCompare(deal));
        },
        onShowInfoModal: id => {
            return dispatch(showInfoModal(id));
        },
        onHideInfoModal: () => {
            return dispatch(hideInfoModal());
        },
        onRequestDealQuote: (deal, zipcode, paymentType) => {
            return dispatch(requestDealQuote(deal, zipcode, paymentType));
        },
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(DealPrice);
