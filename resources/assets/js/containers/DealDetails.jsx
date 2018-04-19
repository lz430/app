import * as Actions from 'actions/index';
import api from 'src/api';
import CashFinanceLeaseCalculator from 'components/CashFinanceLeaseCalculator';
import CompareBar from 'components/CompareBar';
import { connect } from 'react-redux';
import Deal from 'components/Deals/Deal';
import fuelapi from 'src/fuelapi';
import fuelcolor from 'src/fuel-color-map';
import Modal from 'components/Modal';
import miscicons from 'miscicons';
import PropTypes from 'prop-types';
import R from 'ramda';
import React from 'react';
import strings from 'src/strings';
import SVGInline from 'react-svg-inline';
import zondicons from 'zondicons';
import ImageGallery from 'react-image-gallery';
import AccuPricingModal from 'components/AccuPricingModal';
import InfoModalData from 'components/InfoModalData';
import DealPricing from 'src/DealPricing';
import {makeDealPricing} from "../selectors";

class DealDetails extends React.PureComponent {
    constructor(props) {
        super(props);

        this.state = {
            featuredImage: [],
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

        if (this.props.deal.photos.length === 0) {
            this.requestFuelImages();
        } else {
            this.setState({featuredImage: this.props.deal.photos[0]});
        }

        api
            .getDimensions(this.props.deal.version.jato_vehicle_id)
            .then(response => {
                if (!this._isMounted) return;

                this.setState({
                    dimensions: response.data,
                });
            });

        api
            .getWarranties(this.props.deal.version.jato_vehicle_id)
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

    extractFuelImages(data) {
        return (
            data.data.products.map(product =>
                product.productFormats.filter(format => {
                    return format.assets.length > 0;
                }).map(format => {
                    return {
                        id: `fuel_external_${format.id}`,
                        url: format.assets[0].url,
                    };
                })
            )[0] || []
        );
    }

    async requestFuelImages() {
        let vehicleId = null;

        try {
            vehicleId =
                (await fuelapi.getVehicleId(
                    this.props.deal.year,
                    this.props.deal.make,
                    this.props.deal.model
                )).data[0].id || false;
        } catch (e) {
            // Cannot return here because Babel
        }

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
                featuredImage: externalImages[0]
            });
        } catch (e) {
            try {
                const externalImages = this.extractFuelImages(
                    await fuelapi.getExternalImages(vehicleId, 'white')
                );

                this.setState({
                    fuelExternalImages: externalImages,
                    featuredImage: externalImages[0]
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

    galleryImages() {
        return this.allImages().map(image => {
            return { original: image.url };
        });
    }

    renderCalculatorModal() {
        return (
            <Modal
                onClose={this.props.clearSelectedDeal}
                closeText="Back to details"
                deal={this.props.selectedDeal}
            >
                <CashFinanceLeaseCalculator deal={this.props.selectedDeal} />
            </Modal>
        );
    }

    hideModals() {
        this.setState({
            showStandardFeatures: false,
            showFeatures: false,
        });
    }

    renderStandardFeaturesModal(deal) {
        return (
            <Modal
                nowrapper={true}
                onClose={() => { this.hideModals() }}
            >
                <div className="modal__content">
                    <div className="modal__sticker-container">
                        <div className="modal__sticker">Standard Features</div>
                    </div>
                    <div className="modal__header">
                        <div className="modal__titles modal__titles--center">
                            <div className="modal__subtitle modal__subtitle--center">
                                {strings.dealYearMake(deal)}
                            </div>
                            <div className="modal__title modal_title--center">
                                {strings.dealModelTrim(deal)}
                            </div>
                        </div>
                        <div className="modal__close">
                            <SVGInline
                                onClick={() => this.hideModals()}
                                height="20px"
                                width="20px"
                                className="modal__close-x"
                                svg={zondicons['close']}
                            />
                        </div>
                    </div>
                    <div className="modal__body deal-details__modal-body">
                        <h3>Specifications</h3>
                        <hr />

                        <h4>Dimensions</h4>
                        <ul>
                            {this.state.dimensions ? (
                                this.state.dimensions.map((dimension, index) => {
                                    return (
                                        <li key={index}>
                                            {dimension.feature}: {dimension.content}
                                        </li>
                                    );
                                })
                            ) : (
                                <SVGInline svg={miscicons['loading']} />
                            )}
                        </ul>

                        <h4>Warranties</h4>
                        <ul>
                            {this.state.warranties ? (
                                this.state.warranties.map((dimension, index) => {
                                    return (
                                        <li key={index}>
                                            {dimension.feature}: {dimension.content}
                                        </li>
                                    );
                                })
                            ) : (
                                <SVGInline svg={miscicons['loading']} />
                            )}
                        </ul>
                        <h3>Features</h3>
                        <hr />
                        <ul>
                            {deal.features.map((feature, index) => {
                                return <li key={index}>{feature.feature}</li>;
                            })}
                        </ul>
                    </div>
                </div>
            </Modal>
        );
    }

    renderFeaturesModal() {
        return (
            <Modal
                nowrapper={true}
                onClose={() => { this.hideModals() }}
            >

                <div className="modal__content">
                    <div className="modal__sticker-container">
                        <div className="modal__sticker">Additional Options</div>
                    </div>
                    <div className="modal__header">
                        <div className="modal__titles modal__titles--center">
                            <div className="modal__subtitle modal__subtitle--center">
                                {strings.dealYearMake(this.props.deal)}
                            </div>
                            <div className="modal__title modal_title--center">
                                {strings.dealModelTrim(this.props.deal)}
                            </div>
                        </div>
                        <div className="modal__close">
                            <SVGInline
                                onClick={() => this.hideModals()}
                                height="20px"
                                width="20px"
                                className="modal__close-x"
                                svg={zondicons['close']}
                            />
                        </div>
                    </div>
                    <div className="modal__body deal-details__modal-body">
                        <ul>
                            {this.props.deal.vauto_features.map(
                                (feature, index) => {
                                    return <li key={index}>{feature}</li>;
                                }
                            )}
                        </ul>
                    </div>
                </div>
            </Modal>
        );
    }

    renderDeal(deal) {
        return <InfoModalData
            withPricingHeader={false}
            {...R.pick(['deal', 'selectedTab', 'compareList', 'dealPricing'], this.props)}
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

    }

    renderFeaturesAndOptions(deal, index) {
        const inCompareList = R.contains(
            deal,
            R.map(R.prop('deal'), this.props.compareList)
        );
        return (
                <div className="deal-details__deal-content">
                    <div className="deal-details__deal-content-header">
                        <div className="deal-details__deal-content-at-a-glance">
                            This Vehicle At-A-Glance
                        </div>
                        <div className="deal-details__deal-content-color">
                            {deal.color}, {deal.interior_color}
                        </div>
                    </div>
                    <div className="deal-details__deal-content-body">
                        <div>
                            <div className="deal-details__deal-content-subtitle">
                                Standard Features
                            </div>
                            <ul className="deal-details__deal-content-features">
                                {deal.features.slice(0, 5).map((feature, index) => {
                                    return <li key={index}>{feature.feature}</li>;
                                })}
                            </ul>
                            <span
                                className="link deal-details__deal-content-see-all"
                                onClick={() => this.showStandardFeatures()}
                            >
                                See all standard features &gt;
                            </span>
                        </div>
                        <div>
                            <div className="deal-details__deal-content-subtitle">
                                Additional Options
                            </div>
                            <ul className="deal-details__deal-content-features">
                                {deal.vauto_features
                                    .slice(0, 5)
                                    .map((feature, index) => {
                                        return <li key={index}>{feature}</li>;
                                    })}
                            </ul>
                            <a
                                className="link deal-details__deal-content-see-all"
                                onClick={(e) => this.showFeatures(e)}
                            >
                                See all additional options &gt;
                            </a>
                        </div>
                    </div>
                </div>
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
                            <ImageGallery
                                items={this.galleryImages()}
                                showBullets={true}
                                showIndex={true}
                                showThumbnails={false}
                                showPlayButton={false}
                                showFullscreenButton={false}/>
                        </div>
                        {this.renderFeaturesAndOptions(this.props.deal)}
                    </div>
                    <div className="deal-details__pricing">
                        <div>
                            <div className="deal-details__stock-number">
                                Stock# {this.props.deal.stock_number}
                            </div>
                            {this.renderDeal(deal)}
                        </div>
                    </div>
                </div>

                <CompareBar class="compare-bar compare-bar--static" />

                {this.state.showStandardFeatures ? this.renderStandardFeaturesModal(deal) : ''}
                {this.state.showFeatures ? this.renderFeaturesModal(deal) : ''}
                {this.props.selectedDeal ? this.renderCalculatorModal() : ''}
                <AccuPricingModal />
            </div>);
    }
}

DealDetails.propTypes = {
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

function mapStateToProps(state) {
    const getDealPricing = makeDealPricing();
    const mapStateToProps = (state, props) => {
        return {
            compareList: state.compareList,
            selectedTab: state.selectedTab,
            downPayment: state.downPayment,
            termDuration: state.termDuration,
            fallbackDealImage: state.fallbackDealImage,
            selectedDeal: state.selectedDeal,
            employeeBrand: state.employeeBrand,
            dealPricing: new DealPricing(getDealPricing(state, props))
        };
    };
    return mapStateToProps;
}


export default connect(mapStateToProps, Actions)(DealDetails);
