import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { makeDealPricing } from 'apps/common/selectors';
import InfoModalData from 'components/InfoModalData';
import DealPricing from 'src/DealPricing';
import { setPurchaseStrategy } from 'apps/user/actions';
import {
    hideInfoModal,
    selectDeal,
    showAccuPricingModal,
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
        infoModalIsShowingFor: PropTypes.number,
        userLocation: PropTypes.object.isRequired,
        purchaseStrategy: PropTypes.string.isRequired,
        onShowInfoModal: PropTypes.func.isRequired,
        onHideInfoModal: PropTypes.func.isRequired,
        onRequestDealQuote: PropTypes.func.isRequired,
        onSetPurchaseStrategy: PropTypes.func.isRequired,
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
                    onRequestDealQuote={this.props.onRequestDealQuote}
                    onSetPurchaseStrategy={this.props.onSetPurchaseStrategy}
                    compareList={this.props.compareList}
                    selectDeal={this.props.selectDeal}
                    toggleCompare={this.props.toggleCompare}
                    showAccuPricingModal={this.props.showAccuPricingModal}
                />
            </div>
        );
    }
}

const makeMapStateToProps = () => {
    const getDealPricing = makeDealPricing();
    const mapStateToProps = (state, props) => {
        return {
            userLocation: getUserLocation(state),
            purchaseStrategy: state.user.purchasePreferences.strategy,
            compareList: state.common.compareList,
            downPayment: state.common.downPayment,
            termDuration: state.common.termDuration,
            selectedDeal: state.common.selectedDeal,
            employeeBrand: state.common.employeeBrand,
            residualPercent: state.common.residualPercent,
            dealBestOfferTotalValue: dealQuoteRebatesTotal(state, props),
            dealPricing: new DealPricing(getDealPricing(state, props)),
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
        onRequestDealQuote: (deal, zipcode, paymentType) => {
            return dispatch(requestDealQuote(deal, zipcode, paymentType));
        },
    };
};

export default connect(
    makeMapStateToProps,
    mapDispatchToProps
)(ConfirmDeal);
