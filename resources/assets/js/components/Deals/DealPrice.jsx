import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import SVGInline from 'react-svg-inline';
import miscicons from 'miscicons';
import InfoModal from 'components/InfoModal';
import { makeDealPricing } from 'apps/common/selectors';
import DealPricing from 'src/DealPricing';
import DealPriceWrapper from 'components/Hoc/DealPriceWrapper';

import {
    selectDeal,
    requestTargets,
    requestBestOffer,
    getBestOffersForLoadedDeals,
    toggleCompare,
    showInfoModal,
    hideInfoModal,
    showAccuPricingModal,
} from 'apps/common/actions';

import { setPurchaseStrategy } from 'apps/user/actions';

class DealPrice extends React.Component {
    static propTypes = {
        deal: PropTypes.object.isRequired,
        purchaseStrategy: PropTypes.string.isRequired,
        compareList: PropTypes.array.isRequired,
        infoModalIsShowingFor: PropTypes.number,
        onSelectDeal: PropTypes.func.isRequired,
        onSetPurchaseStrategy: PropTypes.func.isRequired,
        onRequestTargets: PropTypes.func.isRequired,
        onRequestBestOffer: PropTypes.func.isRequired,
        onGetBestOffersForLoadedDeals: PropTypes.func.isRequired,
        onToggleCompare: PropTypes.func.isRequired,
        onShowInfoModal: PropTypes.func.isRequired,
        onHideInfoModal: PropTypes.func.isRequired,
        onShowAccuPricingModal: PropTypes.func.isRequired,
    };

    renderPriceExplanationModal() {
        return (
            <InfoModal
                key={this.props.deal.id}
                deal={this.props.deal}
                purchaseStrategy={this.props.purchaseStrategy}
                compareList={this.props.compareList}
                dealPricing={this.props.dealPricing}
                selectDeal={this.props.onSelectDeal}
                selectedTab={this.props.purchaseStrategy}
                selectTab={this.props.onSetPurchaseStrategy}
                requestTargets={this.props.onRequestTargets}
                requestBestOffer={this.props.onRequestBestOffer}
                getBestOffersForLoadedDeals={
                    this.props.onGetBestOffersForLoadedDeals
                }
                toggleCompare={this.props.onToggleCompare}
                showInfoModal={this.props.onShowInfoModal}
                hideInfoModal={this.props.onHideInfoModal}
                infoModalIsShowingFor={this.props.infoModalIsShowingFor}
                showAccuPricingModal={this.props.onShowAccuPricingModal}
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
                return 'Estimated Monthly Finance Payment';
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

const makeMapStateToProps = () => {
    const getDealPricing = makeDealPricing();
    const mapStateToProps = (state, props) => {
        return {
            purchaseStrategy: state.user.purchasePreferences.strategy,
            compareList: state.common.compareList,
            dealPricing: new DealPricing(getDealPricing(state, props)),
            infoModalIsShowingFor: state.common.infoModalIsShowingFor,
        };
    };
    return mapStateToProps;
};

const mapDispatchToProps = dispatch => {
    return {
        onSelectDeal: deal => {
            return dispatch(selectDeal(deal));
        },
        onSetPurchaseStrategy: strategy => {
            return dispatch(setPurchaseStrategy(strategy));
        },
        onRequestTargets: deal => {
            return dispatch(requestTargets(deal));
        },
        onRequestBestOffer: deal => {
            return dispatch(requestBestOffer(deal));
        },
        onGetBestOffersForLoadedDeals: () => {
            return dispatch(getBestOffersForLoadedDeals());
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
        onShowAccuPricingModal: () => {
            return dispatch(showAccuPricingModal());
        },
    };
};

export default connect(
    makeMapStateToProps,
    mapDispatchToProps
)(DealPriceWrapper(DealPrice));
