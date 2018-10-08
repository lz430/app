import React from 'react';
import PropTypes from 'prop-types';

import { dealType, pricingType } from 'types';

import { Container, Row, Col } from 'reactstrap';
import ImageGallery from 'react-image-gallery';

import ApiClient from 'store/api';

import Header from './Header';
import AddToCart from './AddToCart';
import StandardFeaturesModal from './StandardFeaturesModal';
import AdditionalFeaturesModal from './AdditionalFeaturesModal';
import DealColors from 'components/Deals/DealColors';
import * as R from 'ramda';

export default class DealDetail extends React.PureComponent {
    static propTypes = {
        deal: dealType,
        pricing: pricingType.isRequired,
        compareList: PropTypes.array,
        userLocation: PropTypes.object.isRequired,
        purchaseStrategy: PropTypes.string.isRequired,
        handlePaymentTypeChange: PropTypes.func.isRequired,
        handleDiscountChange: PropTypes.func.isRequired,
        handleRebatesChange: PropTypes.func.isRequired,
        handleFinanceDownPaymentChange: PropTypes.func.isRequired,
        handleFinanceTermChange: PropTypes.func.isRequired,
        handleLeaseChange: PropTypes.func.isRequired,
        setCheckoutData: PropTypes.func.isRequired,
        checkoutStart: PropTypes.func.isRequired,
        onToggleCompare: PropTypes.func.isRequired,
    };

    state = {
        featuredImage: [],
        basicFeatures: [],
        fuelEconomy: {},
        upholsteryType: null,
        warranties: null,
        dimensions: null,
        standardFeaturesModalOpen: false,
        additionalFeaturesModalOpen: false,
    };

    componentDidMount() {
        if (this.props.deal) {
            if (this.props.deal.photos.length) {
                this.setState({ featuredImage: this.props.deal.photos[0] });
            }

            const {
                body_style,
                driven_wheels,
                fuel_econ_city,
                fuel_econ_hwy,
            } = this.props.deal.version;

            const { engine, transmission } = this.props.deal;

            const basicFeatures = [
                { name: 'Body', content: body_style },
                { name: 'Drive Train', content: driven_wheels },
                { name: 'Engine', content: engine },
                { name: 'Transmission', content: transmission },
            ];

            const fuelEconomy = {
                city: fuel_econ_city,
                highway: fuel_econ_hwy,
            };

            this.setState({ basicFeatures, fuelEconomy });

            ApiClient.deal
                .dealGetDimensions(this.props.deal.id)
                .then(response => {
                    this.setState({
                        dimensions: response.data,
                    });
                });

            ApiClient.deal
                .dealGetWarranties(this.props.deal.id)
                .then(response => {
                    this.setState({
                        warranties: response.data,
                    });
                });
        }
    }

    handleBuyNow() {
        const { pricing } = this.props;

        const checkoutData = pricing.toCheckoutData();

        this.props.setCheckoutData(
            checkoutData.deal,
            checkoutData.quote,
            checkoutData.paymentStrategy,
            checkoutData.discountType,
            checkoutData.effectiveTerm,
            checkoutData.financeDownPayment,
            checkoutData.leaseAnnualMileage,
            checkoutData.employeeBrand,
            checkoutData.supplierBrand
        );

        this.props.checkoutStart(pricing);
    }

    toggleStandardFeaturesModal() {
        this.setState({
            standardFeaturesModalOpen: !this.state.standardFeaturesModalOpen,
        });
    }

    toggleAdditionalFeaturesModal() {
        this.setState({
            additionalFeaturesModalOpen: !this.state
                .additionalFeaturesModalOpen,
        });
    }

    allImages() {
        return this.props.deal.photos;
    }

    galleryImages() {
        return this.allImages().map(image => {
            return { original: image.url };
        });
    }

    compareButtonClass() {
        return (
            'btn ' +
            (this.compareListContainsDeal()
                ? 'btn-outline-primary'
                : 'btn-primary')
        );
    }

    compareListContainsDeal() {
        return R.contains(
            this.props.deal,
            R.map(R.prop('deal'), this.props.compareList)
        );
    }

    renderFeaturesAndOptions(deal) {
        return (
            <div className="deal-details__deal-content">
                <div className="deal-details__deal-content-header">
                    <div className="deal-details__deal-content-at-a-glance">
                        This Vehicle At-A-Glance
                    </div>
                    <div className="deal-details__deal-content-color">
                        <DealColors deal={deal} />
                    </div>
                </div>
                <div className="deal-details__deal-content-body">
                    <div>
                        <div className="deal-details__deal-content-subtitle">
                            Standard Features
                        </div>
                        <ul className="deal-details__deal-content-features">
                            {this.state.basicFeatures
                                ? this.state.basicFeatures.map(
                                      (feature, index) => {
                                          return (
                                              <li key={index}>
                                                  {feature.name}:{' '}
                                                  {feature.content}
                                              </li>
                                          );
                                      }
                                  )
                                : ''}

                            {this.state.fuelEconomy ? (
                                <li>
                                    Fuel Economy - City:{' '}
                                    {this.state.fuelEconomy.city} Highway:{' '}
                                    {this.state.fuelEconomy.highway}
                                </li>
                            ) : (
                                ''
                            )}
                        </ul>

                        <ul className="deal-details__deal-content-features">
                            {deal.features.slice(0, 5).map((feature, index) => {
                                return <li key={index}>{feature.feature}</li>;
                            })}
                        </ul>
                        <span
                            className="link deal-details__deal-content-see-all"
                            onClick={() => this.toggleStandardFeaturesModal()}
                        >
                            See all standard features &gt;
                        </span>
                    </div>
                    {deal.vauto_features.length > 1 && (
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
                            <span
                                className="link deal-details__deal-content-see-all"
                                onClick={() =>
                                    this.toggleAdditionalFeaturesModal()
                                }
                            >
                                See all additional options &gt;
                            </span>
                        </div>
                    )}
                </div>
            </div>
        );
    }

    render() {
        return (
            <Container className="mb-5">
                <Header deal={this.props.deal} />
                <Row>
                    <Col md="6" lg="8">
                        <div className="deal-details__images">
                            <ImageGallery
                                items={this.galleryImages()}
                                showBullets={true}
                                showIndex={true}
                                showThumbnails={false}
                                showPlayButton={false}
                                showFullscreenButton={false}
                            />
                        </div>
                        {this.renderFeaturesAndOptions(this.props.deal)}
                        <button
                            className={this.compareButtonClass(this.props.deal)}
                            onClick={() =>
                                this.props.onToggleCompare(this.props.deal)
                            }
                        >
                            {this.compareListContainsDeal(this.props.deal)
                                ? 'Remove from compare'
                                : 'Add to compare'}
                        </button>
                    </Col>
                    <Col md="6" lg="4">
                        <AddToCart
                            deal={this.props.deal}
                            purchaseStrategy={this.props.purchaseStrategy}
                            handlePaymentTypeChange={
                                this.props.handlePaymentTypeChange
                            }
                            pricing={this.props.pricing}
                            handleDiscountChange={
                                this.props.handleDiscountChange
                            }
                            handleRebatesChange={this.props.handleRebatesChange}
                            handleFinanceDownPaymentChange={
                                this.props.handleFinanceDownPaymentChange
                            }
                            handleFinanceTermChange={
                                this.props.handleFinanceTermChange
                            }
                            handleLeaseChange={this.props.handleLeaseChange}
                            handleBuyNow={this.handleBuyNow.bind(this)}
                            onToggleCompare={this.props.onToggleCompare}
                            compareList={this.props.compareList}
                            userLocation={this.props.userLocation}
                        />
                    </Col>
                </Row>

                <StandardFeaturesModal
                    toggle={this.toggleStandardFeaturesModal.bind(this)}
                    isOpen={this.state.standardFeaturesModalOpen}
                    deal={this.props.deal}
                    basicFeatures={this.state.basicFeatures}
                    fuelEconomy={this.state.fuelEconomy}
                    warranties={this.state.warranties}
                    dimensions={this.state.dimensions}
                />

                <AdditionalFeaturesModal
                    toggle={this.toggleAdditionalFeaturesModal.bind(this)}
                    isOpen={this.state.additionalFeaturesModalOpen}
                    deal={this.props.deal}
                />
            </Container>
        );
    }
}
