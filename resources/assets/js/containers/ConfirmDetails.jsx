import * as Actions from 'actions/index';
import api from 'src/api';
import CashFinanceLeaseCalculator from 'components/CashFinanceLeaseCalculator';
import ConfirmDeal from 'components/ConfirmDeal';
import { connect } from 'react-redux';
import fuelapi from 'src/fuelapi';
import fuelcolor from 'src/fuel-color-map';
import Modal from 'components/Modal';
import PropTypes from 'prop-types';
import purchase from 'src/purchase';
import R from 'ramda';
import React from 'react';
import rebates from 'src/rebates';
import strings from 'src/strings';


class ConfirmDetails extends React.PureComponent {
    constructor(props) {
        super(props);

        this.state = {
            featuredImage: props.deal.photos[0],
            fuelExternalImages: [],
            fuelInternalImages: [],
            warranties: null,
            dimensions: null,
            showStandardFeatures: false,
            showFeatures: false,
        };
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    componentDidMount() {
        this._isMounted = true;

        api
            .getDimensions(this.props.deal.versions[0].jato_vehicle_id)
            .then(response => {
                if (!this._isMounted) return;

                this.setState({
                    dimensions: response.data,
                });
            });

        api
            .getWarranties(this.props.deal.versions[0].jato_vehicle_id)
            .then(response => {
                if (!this._isMounted) return;

                this.setState({
                    warranties: response.data,
                });
            });
    }

    showStandardFeatures() {
        this.setState({
            showStandardFeatures: true,
        });
    }

    showFeatures() {
        this.setState({
            showFeatures: true,
        });
    }

    selectFeaturedImage(index) {
        this.setState({
            featuredImage: this.allImages()[index],
        });
    }

    renderDealRebatesModal() {
        return (
            <Modal
                onClose={this.props.clearSelectedDeal}
                closeText="Back to results"
            >
                <CashFinanceLeaseCalculator />
            </Modal>
        );
    }
    renderFeaturedImage() {
        return (
            <img
                className="deal-details__primary-image"
                src={R.propOr(this.state.q, 'url', this.state.featuredImage)}
            />
        );
    }

    hideModals() {
        this.setState({
            showStandardFeatures: false,
            showFeatures: false,
        });
    }

    renderDealRebatesModal() {
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
                                    rebates.getSelectedRebatesForDealAndType(
                                        this.props.dealRebates,
                                        this.props.selectedRebates,
                                        this.props.selectedTab,
                                        deal
                                    ),
                                    this.props.termDuration,
                                    this.props.isEmployee
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
                            {this.renderFeaturedImage()}
                        </div>
                    </div>
                    <div className="deal-details__pricing">
                        {this.renderDeal(deal)}
                    </div>
                    {this.props.selectedDeal ? this.renderDealRebatesModal() : ''}
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

const mapStateToProps = state => {
    return {
        compareList: state.compareList,
        selectedTab: state.selectedTab,
        downPayment: state.downPayment,
        dealRebates: state.dealRebates,
        selectedRebates: state.selectedRebates,
        termDuration: state.termDuration,
        fallbackDealImage: state.fallbackDealImage,
        selectedDeal: state.selectedDeal,
        isEmployee: state.isEmployee,
    };
};

export default connect(mapStateToProps, Actions)(ConfirmDetails);

// When selectedTab, downPayment, etc. are initially saved to redux store, also save to localStorage
// on ComponentWillMount in ConfirmDetails, check localStorage for these values; if they exist, call the actions required to save them to redux
// Once they are in Redux, they should be picked up by mapStateToProps and passed down to ConfirmDetail properly
// Can also look into packages used to automatically re-hydrate Redux store
// "Persisting Redux store to localStorage/SessionStorage"