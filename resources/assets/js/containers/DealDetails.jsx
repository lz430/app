import React from 'react';
import PropTypes from 'prop-types';
import R from 'ramda';
import fuelapi from 'src/fuelapi';
import fuelcolor from 'src/fuel-color-map';
import Deal from 'components/Deal';
import purchase from 'src/purchase';
import rebates from 'src/rebates';
import { connect } from 'react-redux';
import * as Actions from 'actions/index';
import Modal from 'components/Modal';
import CashFinanceLeaseCalculator from 'components/CashFinanceLeaseCalculator';
import strings from 'src/strings';

class DealDetails extends React.PureComponent {
    constructor(props) {
        super(props);

        this.state = {
            featuredImage: props.deal.photos[0],
            fuelExternalImages: [],
            fuelInternalImages: [],
            showFeatures: false,
            showEquipment: false,
        };
    }

    showFeatures() {
        this.setState({
            showFeatures: true,
        });
    }

    showEquipment() {
        this.setState({
            showEquipment: true,
        });
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
        const vehicleId =
            (await fuelapi.getVehicleId(
                this.props.deal.year,
                this.props.deal.make,
                this.props.deal.model
            )).data[0].id || false;

        if (!vehicleId) return;

        try {
            const externalImages = this.extractFuelImages(
                await fuelapi.getExternalImages(
                    vehicleId,
                    fuelcolor.convert(this.props.deal.color)
                )
            );

            this.setState({
                fuelExternalImages: externalImages,
            });
        } catch (e) {
            try {
                const externalImages = this.extractFuelImages(
                    await fuelapi.getExternalImages(vehicleId, 'white')
                );

                this.setState({
                    fuelExternalImages: externalImages,
                });
            } catch (e) {
                // No Fuel Images Available.
            }
        }
    }

    selectFeaturedImage(index) {
        this.setState({
            featuredImage: this.allImages()[index],
        });
    }

    allImages() {
        return R.concat(
            this.props.deal.photos,
            R.concat(
                this.state.fuelExternalImages,
                this.state.fuelInternalImages
            )
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

    renderDot(photo, index) {
        const color = this.state.featuredImage.url === photo.url
            ? 'gray'
            : 'none';
        return (
            <svg
                key={index}
                style={{
                    cursor: 'pointer',
                    margin: '5px',
                }}
                height="10"
                width="10"
                onClick={this.selectFeaturedImage.bind(this, index)}
            >
                <circle cx="5" cy="5" r="4" stroke="gray" fill={color} />
            </svg>
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
            showFeatures: false,
            showEquipment: false,
        });
    }

    renderFeaturesModal() {
        return (
            <Modal
                onClose={() => this.hideModals()}
                title="Select brand preference"
                subtitle="Please select one or more brands that you are considering"
            >
                <div>
                    <ul>
                        {this.props.deal.features.map((feature, index) => {
                            return (
                                <li key={index}>
                                    {feature.feature}
                                </li>
                            );
                        })}
                    </ul>
                </div>
            </Modal>
        );
    }

    renderEquipmentModal(deal) {
        return (
            <Modal
                onClose={() => this.hideModals()}
                title="Select brand preference"
                subtitle="Please select one or more brands that you are considering"
            >
                <div>
                    <ul>
                        {deal.versions[0].equipment.map((equipment, index) => {
                            return (
                                <li key={index}>
                                    {equipment.name}
                                </li>
                            );
                        })}
                    </ul>
                </div>
            </Modal>
        );
    }

    renderDeal(deal, index) {
        const inCompareList = R.contains(deal, this.props.compareList);
        return (
            <Deal deal={deal} key={index} hideImageAndTitle={true}>
                <div className="deal-details__deal-content">
                    VEHICLE #{deal.vin.substr(deal.vin.length - 8)} AT A GLANCE
                    <div className="deal-details__deal-content-subtitle">
                        Vehicle Standard Features
                    </div>

                    <ul>
                        {deal.versions[0].equipment
                            .slice(0, 5)
                            .map((equipment, index) => {
                                return (
                                    <li key={index}>
                                        {equipment.name}
                                    </li>
                                );
                            })}
                    </ul>

                    <a href="#" onClick={() => this.showFeatures()}>
                        SEE ALL STANDARD FEATURES
                    </a>
                    <br />

                    <div className="deal-details__deal-content-subtitle">
                        Additional Options On This Vehicle
                    </div>
                    <ul>
                        {deal.features.slice(0, 5).map((feature, index) => {
                            return (
                                <li key={index}>
                                    {feature.feature}
                                </li>
                            );
                        })}
                    </ul>

                    <a href="#" onClick={() => this.showEquipment()}>
                        SEE ALL ADDITIONAL OPTIONS
                    </a>
                    <br />

                    <div className="deal-details__buttons">
                        <button
                            onClick={() =>
                                this.props.toggleCompare(this.props.deal)}
                            className={
                                'deal-details__button deal-details__button--small ' +
                                    (inCompareList
                                        ? 'deal-details__button--blue'
                                        : '')
                            }
                        >
                            {inCompareList
                                ? 'Remove from Compare'
                                : 'Add to Compare'}
                        </button>

                        <button
                            className="deal-details__button deal-details__button--small deal-details__button--blue"
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
                                    this.props.termDuration
                                )}
                        >
                            Buy Now

                        </button>
                    </div>
                </div>
            </Deal>
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
                            <div className="deal-details__dots">
                                {this.allImages().map((image, index) =>
                                    this.renderDot(image, index)
                                )}
                            </div>
                        </div>
                    </div>
                    <div className="deal-details__pricing">
                        {this.renderDeal(deal)}
                    </div>
                </div>

                {this.state.showFeatures ? this.renderFeaturesModal(deal) : ''}
                {this.state.showEquipment
                    ? this.renderEquipmentModal(deal)
                    : ''}
                {this.props.selectedDeal ? this.renderDealRebatesModal() : ''}
            </div>
        );
    }
}

DealDetails.propTypes = {
    deal: PropTypes.shape({
        year: PropTypes.string.isRequired,
        msrp: PropTypes.number.isRequired,
        price: PropTypes.number.isRequired,
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
    };
};

export default connect(mapStateToProps, Actions)(DealDetails);
