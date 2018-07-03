import React from 'react';
import { connect } from 'react-redux';
import ConfirmDeal from './components/ConfirmDeal';
import PropTypes from 'prop-types';
import DealImage from 'components/Deals/DealImage';

import { dealPricingFromCheckoutFactory } from 'src/DealPricing';
import { getUserLocation } from 'apps/user/selectors';
import { checkoutStart } from 'apps/checkout/actions';

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
        onCheckoutStart: PropTypes.func.isRequired,
    };

    handleConfirmPurchase() {
        console.log('handleConfirmPurchase');
        console.log(this.props.dealPricing);
        this.props.onCheckoutStart(this.props.dealPricing);

        //purchase.start(this.props.dealPricing);
    }

    renderDeal(deal) {
        return (
            <ConfirmDeal
                deal={deal}
                hideImageAndTitle={true}
                onConfirmPurchase={this.handleConfirmPurchase.bind(this)}
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

const mapStateToProps = (state, props) => {
    return {
        deal: state.checkout.deal,
        quote: state.checkout.quote,
        purchaseStrategy: state.checkout.strategy,
        isLoading: state.checkout.isLoading,
        userLocation: getUserLocation(state),
        dealPricing: dealPricingFromCheckoutFactory(state, props),
    };
};

const mapDispatchToProps = dispatch => {
    return {
        onCheckoutStart: dealPricing => {
            return dispatch(checkoutStart(dealPricing));
        },
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Container);
