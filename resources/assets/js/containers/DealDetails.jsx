import React from 'react';
import PropTypes from 'prop-types';
import R from 'ramda';
import fuelapi from 'src/fuelapi';
import fuelcolor from 'src/fuel-color-map';
import Deal from 'components/Deal';
import purchase from 'src/purchase';
import rebates from 'src/rebates';
import api from 'src/api';
import { connect } from 'react-redux';
import * as Actions from 'actions/index';
import Modal from 'components/Modal';
import CashFinanceLeaseCalculator from 'components/CashFinanceLeaseCalculator';
import strings from 'src/strings';
import CompareBar from 'components/CompareBar';
import SVGInline from 'react-svg-inline';
import zondicons from 'zondicons';

class DealDetails extends React.PureComponent {
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
        const color =
            this.state.featuredImage.url === photo.url ? 'gray' : 'none';
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
            showStandardFeatures: false,
            showFeatures: false,
        });
    }

    renderStandardFeaturesModal() {
        return (
            <Modal>
                <div className="modal__content">
                    <div className="modal__sticker-container">
                        <div className="modal__sticker">Standard Features</div>
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
                </div>
                <div className="deal-details__modal-body">
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
                            'Loading...'
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
                            'Loading...'
                        )}
                    </ul>

                    <h3>Features</h3>
                    <hr />

                    <ul>
                        {this.props.deal.vauto_features.map(
                            (feature, index) => {
                                return <li key={index}>{feature}</li>;
                            }
                        )}
                    </ul>
                </div>
            </Modal>
        );
    }

    renderFeaturesModal(deal) {
        return (
            <Modal>
                <div className="modal__content">
                    <div className="modal__sticker-container">
                        <div className="modal__sticker">Additional Options</div>
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
                </div>
                <div className="deal-details__modal-body">
                    <ul>
                        {deal.features.map((feature, index) => {
                            return <li key={index}>{feature.feature}</li>;
                        })}
                    </ul>
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
                    VEHICLE #{deal.vin.substr(deal.vin.length - 8)} AT A GLANCE
                    <div className="deal-details__deal-content-subtitle">
                        Vehicle Standard Features
                    </div>
                    <ul>
                        {deal.features.slice(0, 5).map((feature, index) => {
                            return <li key={index}>{feature.feature}</li>;
                        })}
                    </ul>
                    <a href="#" onClick={() => this.showStandardFeatures()}>
                        SEE ALL STANDARD FEATURES
                    </a>
                    <br />
                    <div className="deal-details__deal-content-subtitle">
                        Additional Options On This Vehicle
                    </div>
                    <ul>
                        {deal.vauto_features
                            .slice(0, 5)
                            .map((feature, index) => {
                                return <li key={index}>{feature}</li>;
                            })}
                    </ul>
                    <a href="#" onClick={() => this.showFeatures()}>
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
                            {inCompareList ? (
                                'Remove from Compare'
                            ) : (
                                'Add to Compare'
                            )}
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
                                    this.props.termDuration,
                                    this.props.isEmployee
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

                <CompareBar class="compare-bar compare-bar--static" />

                {this.state.showStandardFeatures ? (
                    this.renderStandardFeaturesModal(deal)
                ) : (
                    ''
                )}
                {this.state.showFeatures ? this.renderFeaturesModal(deal) : ''}
                {this.props.selectedDeal ? this.renderDealRebatesModal() : ''}
            </div>
        );
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
        dealRebates: state.dealRebates,
        selectedRebates: state.selectedRebates,
        termDuration: state.termDuration,
        fallbackDealImage: state.fallbackDealImage,
        selectedDeal: state.selectedDeal,
        isEmployee: state.isEmployee,
    };
};

export default connect(mapStateToProps, Actions)(DealDetails);
