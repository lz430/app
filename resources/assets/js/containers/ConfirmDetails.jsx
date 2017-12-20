import * as Actions from 'actions/index';
import CashFinanceLeaseCalculator from 'components/CashFinanceLeaseCalculator';
import ConfirmDeal from 'components/ConfirmDeal';
import { connect } from 'react-redux';
import Modal from 'components/Modal';
import PropTypes from 'prop-types';
import purchase from 'src/purchase';
import R from 'ramda';
import React from 'react';
import rebates from 'src/rebates';
import strings from 'src/strings';
import fuelapi from 'src/fuelapi';
import fuelcolor from 'src/fuel-color-map';
import DealImage from 'components/Deals/DealImage';

class ConfirmDetails extends React.PureComponent {
    constructor(props) {
        super(props);

        this.state = {
            featuredImage: props.deal.photos[0],
            fallbackDealImage: '/images/dmr-logo.svg',
        };
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    componentDidMount() {
        this._isMounted = true;

        if (this.props.deal.photos.length === 0) {
            this.requestFuelImages();
        }

    }

    renderFeaturedImage() {
        return (
            <DealImage
                featureImageClass="deal-details__primary-image"
                featuredImageUrl={this.featuredImageUrl()}
            />
        );
    }

    featuredImageUrl() {
        return R.propOr(
            R.propOr(
                this.state.fallbackDealImage,
                'url',
                this.state.featuredImage
            ),
            'url',
            this.props.deal.photos[0]
        );
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

    extractFuelImages(data) {
        return (
            data.data.products.map(product =>
                product.productFormats.map(format => {
                    return {
                        id: `fuel_external_${format.id}`,
                        url: format.assets[0].url,
                    };
                })
            )[0] || []
        );
    }

    async requestFuelImages() {
        const deal = this.props.deal;

        const vehicleId =
            (await fuelapi.getVehicleId(deal.year, deal.make, deal.model))
                .data[0].id || false;
        if (!vehicleId) return;

        try {
            const externalImages = this.extractFuelImages(
                await fuelapi.getExternalImages(
                    vehicleId,
                    fuelcolor.convert(deal.color)
                )
            );

            if (!this._isMounted) return;
            this.setState({ featuredImage: externalImages[0] });
        } catch (e) {
            try {
                const externalImages = this.extractFuelImages(
                    await fuelapi.getExternalImages(vehicleId, 'white')
                );

                if (!this._isMounted) return;
                this.setState({ featuredImage: externalImages[0] });
            } catch (e) {
                // No Fuel Images Available.
            }
        }
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
        selectedTab: state.selectedTab,
        downPayment: state.downPayment,
        dealRebates: state.dealRebates,
        selectedRebates: state.selectedRebates,
        termDuration: state.termDuration,
        fallbackDealImage: state.fallbackDealImage,
        selectedDeal: state.selectedDeal,
        employeeBrand: state.employeeBrand,
    };
};

export default connect(mapStateToProps, Actions)(ConfirmDetails);
