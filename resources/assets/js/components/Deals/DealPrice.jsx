import React from 'react';
import R from 'ramda';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import * as Actions from 'apps/common/actions';
import SVGInline from 'react-svg-inline';
import miscicons from 'miscicons';
import InfoModal from 'components/InfoModal';
import { makeDealPricing } from 'apps/common/selectors';
import DealPricing from 'src/DealPricing';
import DealPriceWrapper from 'components/Hoc/DealPriceWrapper';

class DealPrice extends React.Component {
    static propTypes = {
        deal: PropTypes.object.isRequired,
        purchaseStrategy: PropTypes.string.isRequired,
    };

    renderPriceExplanationModal() {
        return (
            <InfoModal
                key={this.props.deal.id}
                {...R.pick(
                    ['deal', 'purchaseStrategy', 'compareList', 'dealPricing'],
                    this.props
                )}
                {...R.pick(
                    [
                        'selectDeal',
                        'selectTab',
                        'requestTargets',
                        'requestBestOffer',
                        'getBestOffersForLoadedDeals',
                        'toggleCompare',
                        'showInfoModal',
                        'hideInfoModal',
                        'infoModalIsShowingFor',
                        'showAccuPricingModal',
                    ],
                    this.props
                )}
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
            compareList: state.common.compareList, // should be selected
            dealPricing: new DealPricing(getDealPricing(state, props)),
            infoModalIsShowingFor: state.common.infoModalIsShowingFor,
        };
    };
    return mapStateToProps;
};

export default connect(makeMapStateToProps)(DealPriceWrapper(DealPrice));
