import api from 'src/api';
import miscicons from 'miscicons';
import React from 'react';
import strings from 'src/strings';
import SVGInline from 'react-svg-inline';
import zondicons from 'zondicons';
import util from 'src/util';
import PropTypes from 'prop-types';
import * as Actions from 'actions/index';
import { connect } from 'react-redux';
import Modal from 'components/Modal';
import { makeDealBestOfferTotalValue, makeDealPricing } from 'selectors/index';
import formulas from 'src/formulas';
import InfoModalData from "./InfoModalData";
import DealPricing from 'src/DealPricing';
import R from "ramda";

class ConfirmDeal extends React.PureComponent {
    render() {
        const deal = this.props.deal;

        return (
            <div className={'confirm-deal'}>
                <InfoModalData
                    withPricingHeader={false}
                    withPricingTabs={false}
                    withCompareInsteadOfBack={false}
                    withFinalSelectionHeader={true}
                    withCustomizeQuoteOrBuyNow={false}
                    withConfirmPurchase={true}
                    {...R.pick(['deal', 'selectedTab', 'compareList', 'dealPricing', 'onConfirmPurchase'], this.props)}
                    {...R.pick([
                        'selectDeal',
                        'selectTab',
                        'requestTargets',
                        'requestBestOffer',
                        'getBestOffersForLoadedDeals',
                        'toggleCompare',
                        'showAccuPricingModal'
                    ], this.props)}
                />
            </div>
        );
    }
}

ConfirmDeal.propTypes = {
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
};

const makeMapStateToProps = () => {
    const getDealBestOfferTotalValue = makeDealBestOfferTotalValue();
    const getDealPricing = makeDealPricing();
    const mapStateToProps = (state, props) => {
        return {
            compareList: state.compareList,
            selectedTab: state.selectedTab,
            downPayment: state.downPayment,
            termDuration: state.termDuration,
            selectedDeal: state.selectedDeal,
            employeeBrand: state.employeeBrand,
            residualPercent: state.residualPercent,
            dealTargets: state.dealTargets,
            selectedTargets: state.selectedTargets,
            dealBestOfferTotalValue: getDealBestOfferTotalValue(state, props),
            dealPricing: new DealPricing(getDealPricing(state, props))
        };
    };
    return mapStateToProps;
};

export default connect(makeMapStateToProps, Actions)(ConfirmDeal);
