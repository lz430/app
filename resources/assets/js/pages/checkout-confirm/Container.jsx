import React from 'react';
import { connect } from 'react-redux';

import * as Actions from 'apps/common/actions';
import ConfirmDeal from './components/ConfirmDeal';
import PropTypes from 'prop-types';
import purchase from 'src/purchase';
import DealImage from 'components/Deals/DealImage';

import { makeDealPricing } from 'apps/common/selectors';

import DealPricing from 'src/DealPricing';

class Container extends React.PureComponent {
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
    };

    renderDeal(deal, index) {
        return (
            <ConfirmDeal
                deal={deal}
                key={index}
                hideImageAndTitle={true}
                onConfirmPurchase={() => purchase.start(this.props.dealPricing)}
            />
        );
    }

    render() {
        const deal = this.props.deal;

        return (
            <div>
                <div className="deal-details">
                    <div className="deal-details__images-and-title">
                        <div className="deal-details__title">
                            <div className="deal-details__title-model-trim">
                                Say hello to your new car!
                            </div>
                        </div>
                        <div className="deal-details__images">
                            <DealImage
                                featureImageClass="deal-details__primary-image"
                                deal={this.props.deal}
                            />
                        </div>
                        <div>
                            Confirming this purchase is not a binding contract.
                            You may cancel at any time. Once you confirm this
                            purchase, we will finalize financing and delivery
                            details.
                        </div>
                    </div>
                    <div className="deal-details__pricing">
                        {this.renderDeal(deal)}
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
            selectedTab: state.selectedTab,
            downPayment: state.downPayment,
            dealTargets: state.dealTargets,
            termDuration: state.termDuration,
            fallbackDealImage: state.fallbackDealImage,
            selectedDeal: state.selectedDeal,
            employeeBrand: state.employeeBrand,
            dealPricing: new DealPricing(getDealPricing(state, props)),
        };
    };
    return mapStateToProps;
};

export default connect(
    makeMapStateToProps,
    Actions
)(Container);
