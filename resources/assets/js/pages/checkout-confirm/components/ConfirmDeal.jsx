import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { dealPricingFromCheckoutFactory } from 'src/DealPricing';
import InfoModalData from 'components/InfoModalData';
import { setPurchaseStrategy } from 'apps/user/actions';

import {
    hideInfoModal,
    selectDeal,
    showInfoModal,
    toggleCompare,
} from 'apps/common/actions';

import { requestDealQuote } from 'apps/pricing/actions';
import { getUserLocation } from 'apps/user/selectors';
import { dealQuoteRebatesTotal } from 'apps/common/selectors';

class ConfirmDeal extends React.PureComponent {
    static propTypes = {
        deal: PropTypes.shape({
            year: PropTypes.string.isRequired,
            msrp: PropTypes.number.isRequired,
            employee_price: PropTypes.number.isRequired,
            supplier_price: PropTypes.number.isRequired,
            make: PropTypes.string.isRequired,
            model: PropTypes.string.isRequired,
            id: PropTypes.number.isRequired,
            vin: PropTypes.string.isRequired,
        }),
        compareList: PropTypes.array,
        infoModalIsShowingFor: PropTypes.number,
        userLocation: PropTypes.object.isRequired,
        purchaseStrategy: PropTypes.string.isRequired,
        onShowInfoModal: PropTypes.func.isRequired,
        onHideInfoModal: PropTypes.func.isRequired,
        onRequestDealQuote: PropTypes.func.isRequired,
        onSetPurchaseStrategy: PropTypes.func.isRequired,
        onToggleCompare: PropTypes.func.isRequired,
        onSelectDeal: PropTypes.func.isRequired,
    };

    render() {
        return (
            <div className={'confirm-deal'}>
                <InfoModalData
                    withPricingHeader={false}
                    withPricingTabs={false}
                    withCompareInsteadOfBack={false}
                    withFinalSelectionHeader={true}
                    withCustomizeQuoteOrBuyNow={false}
                    withConfirmPurchase={true}
                    deal={this.props.deal}
                    userLocation={this.props.userLocation}
                    purchaseStrategy={this.props.purchaseStrategy}
                    dealPricing={this.props.dealPricing}
                    compareList={this.props.compareList}
                    onRequestDealQuote={this.props.onRequestDealQuote}
                    onSetPurchaseStrategy={this.props.onSetPurchaseStrategy}
                    selectDeal={this.props.onSelectDeal}
                    toggleCompare={this.props.onToggleCompare}
                />
            </div>
        );
    }
}

const mapStateToProps = (state, props) => {
    return {
        userLocation: getUserLocation(state),
        purchaseStrategy: state.user.purchasePreferences.strategy,
        compareList: state.common.compareList,
        dealBestOfferTotalValue: dealQuoteRebatesTotal(state, props),
        dealPricing: dealPricingFromCheckoutFactory(state, props),
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
)(ConfirmDeal);
