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
                closeText="Back to results"
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

    renderDeal(deal, index) {
        const inCompareList = R.contains(
            deal,
            R.map(R.prop('deal'), this.props.compareList)
        );
        return (
            <Deal deal={deal} key={index} hideImageAndTitle={true}>
                <div className="deal-details__deal-content">
                    <div className="deal-details__deal-content-at-a-glance">
                        This Vehicle At-A-Glance
                    </div>
                    <div className="deal-details__deal-content-subtitle">
                        Vehicle #{deal.vin.substr(deal.vin.length - 8)} Standard Features
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
                    <div className="deal-details__deal-content-subtitle">
                        Vehicle #{deal.vin.substr(deal.vin.length - 8)} Additional Options
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
                    <div className="deal-details__buttons">
                        <button
                            onClick={() =>
                                this.props.toggleCompare(this.props.deal)}
                            className={
                                'deal-details__button deal-details__button--small deal-details__button--blue ' +
                                (inCompareList
                                    ? 'deal-details__button--blue'
                                    : '')
                            }
                        >
                            {inCompareList ? (
                                'Remove from Compare'
                            ) : (
                                'Add to Compare'
                            )}
                        </button>

                        <button
                            className="deal-details__button deal-details__button--small deal-details__button--pink"
                            onClick={() => window.location=`/confirm/${this.props.deal.id}`}

                        >
                            Buy Now
                        </button>
                    </div>

                    <div className="accupricing-cta">
                        <a onClick={this.props.showAccuPricingModal}>
                            <img src="/images/accupricing-logo.png" className="accupricing-cta__logo" />
                        </a>
                        <p className="accupricing-cta__disclaimer">
                            * Includes taxes, dealer fees and rebates.
                        </p>
                    </div>
                </div>
            </Deal>
        );
    }

    renderAccuPricingCta() {
        return (
            <div>
                <div className="accupricing-cta accupricing-cta--horizontal">
                    <a onClick={this.props.showAccuPricingModal}>
                        <img src="/images/accupricing-logo.png" className="accupricing-cta__logo" />
                    </a>
                    <p className="accupricing-cta__disclaimer">
                        * Includes taxes, dealer fees and rebates.
                    </p>
                </div>
            </div>
        );
    }

    renderSelectedTabButtons() {
        return (
            <div className="button-group">
                <div
                    onClick={() => {
                        this.handleTabChange('cash');
                    }}
                    className={`button-group__button ${
                        this.props.selectedTab === 'cash'
                            ? 'button-group__button--selected'
                            : ''
                        }`}
                >
                    Cash
                </div>
                <div
                    onClick={() => {
                        this.handleTabChange('finance');
                    }}
                    className={`button-group__button ${
                        this.props.selectedTab === 'finance'
                            ? 'button-group__button--selected'
                            : ''
                        }`}
                >
                    Finance
                </div>
                <div
                    onClick={() => {
                        this.handleTabChange('lease');
                    }}
                    className={`button-group__button ${
                        this.props.selectedTab === 'lease'
                            ? 'button-group__button--selected'
                            : ''
                        }`}
                >
                    Lease
                </div>
            </div>
        )
    }
    
    render() {
        const deal = this.props.deal;

        return (
            <div>
                <div className="deal-details__top-row">
                    <div className="deal-details__top-row__section deal-details__top-row__section--accuPricing">
                        {this.renderAccuPricingCta()}
                    </div>
                    <div className="deal-details__top-row__section deal-details__top-row__section--tabButtons">
                        {this.renderSelectedTabButtons()}
                    </div>
                </div>

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

    handleTabChange(tabName) {
        this.props.selectTab(tabName);
        this.props.getBestOffersForLoadedDeals();
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

const mapStateToProps = state => {
    return {
        compareList: state.compareList,
        selectedTab: state.selectedTab,
        downPayment: state.downPayment,
        termDuration: state.termDuration,
        fallbackDealImage: state.fallbackDealImage,
        selectedDeal: state.selectedDeal,
        employeeBrand: state.employeeBrand,
    };
};

export default connect(mapStateToProps, Actions)(DealDetails);
