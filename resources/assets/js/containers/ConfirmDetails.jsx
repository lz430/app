import * as Actions from 'actions/index';
import CashFinanceLeaseCalculator from 'components/CashFinanceLeaseCalculator';
import ConfirmDeal from 'components/ConfirmDeal';
import { connect } from 'react-redux';
import Modal from 'components/Modal';
import PropTypes from 'prop-types';
import purchase from 'src/purchase';
import React from 'react';
import strings from 'src/strings';
import DealImage from 'components/Deals/DealImage';
import { makeDealBestOfferTotalValue, makeDealBestOffer } from 'selectors/index';

class ConfirmDetails extends React.PureComponent {
    componentWillUnmount() {
        this._isMounted = false;
    }

    componentDidMount() {
        this._isMounted = true;
    }

    renderCalculatorModal() {
        return (
            <Modal
                onClose={this.props.clearSelectedDeal}
                closeText="Back to results"
            >
                <CashFinanceLeaseCalculator />
            </Modal>
        );
    }

    renderDeal(deal, index) {
        return (
            <ConfirmDeal deal={deal} key={index} hideImageAndTitle={true}>
                <div className="deal-details__deal-content">
                    <div className="deal-details__buttons">
                        <button
                            className="deal-details__button deal-details__button--small deal-details__button--pink"
                            onClick={() =>
                                purchase.start(
                                    deal,
                                    this.props.selectedTab,
                                    this.props.downPayment,
                                    this.props.dealBestOfferTotalValue,
                                    this.props.dealBestOffer,
                                    this.props.termDuration,
                                    this.props.employeeBrand
                                )}
                        >
                            Buy Now
                        </button>
                    </div>
                </div>
            </ConfirmDeal>
        );
    }

    render() {
        const deal = this.props.deal;

        return (
            <div>
                <div className="deal-details">
                    <div className="deal-details__images-and-title">
                        <div className="deal-details__title">
                            <div className="deal-details__title-year-make">
                                {strings.dealYearMake(this.props.deal)}
                            </div>
                            <div className="deal-details__title-model-trim">
                                {strings.dealModelTrim(this.props.deal)}
                            </div>
                        </div>
                        <div className="deal-details__images">
                            <DealImage
                                featureImageClass="deal-details__primary-image"
                                deal={this.props.deal}
                            />
                        </div>
                    </div>
                    <div className="deal-details__pricing">
                        {this.renderDeal(deal)}
                    </div>
                    {this.props.selectedDeal ? this.renderCalculatorModal() : ''}
                </div>
            </div>
        );
    }
}

ConfirmDetails.propTypes = {
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
    const getDealBestOffer = makeDealBestOffer();
    const mapStateToProps = (state, props) => {
        return {
            selectedTab: state.selectedTab,
            downPayment: state.downPayment,
            dealTargets: state.dealTargets,
            termDuration: state.termDuration,
            fallbackDealImage: state.fallbackDealImage,
            selectedDeal: state.selectedDeal,
            employeeBrand: state.employeeBrand,
            dealBestOfferTotalValue: getDealBestOfferTotalValue(state, props),
            dealBestOffer: getDealBestOffer(state, props),
        };
    };
    return mapStateToProps;
};

export default connect(makeMapStateToProps, Actions)(ConfirmDetails);
