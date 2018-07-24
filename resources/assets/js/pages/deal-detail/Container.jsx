import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import R from 'ramda';
import { Container, Row, Col } from 'reactstrap';

import * as legacyActions from 'apps/common/actions';

import strings from 'src/strings';

import miscicons from 'miscicons';
import SVGInline from 'react-svg-inline';
import zondicons from 'zondicons';

import ImageGallery from 'react-image-gallery';
import { dealPricingFactory } from 'src/DealPricing';

import ApiClient from 'store/api';

import CompareBar from 'components/CompareBar';
import Modal from 'components/Modal';

import Header from './components/Header';

import mapAndBindActionCreators from 'util/mapAndBindActionCreators';
import { setPurchaseStrategy } from 'apps/user/actions';
import { setCheckoutData, checkoutStart } from 'apps/checkout/actions';
import * as selectDiscountActions from './modules/selectDiscount';
import * as financeActions from './modules/finance';
import * as leaseActions from './modules/lease';

import { initPage, receiveDeal, dealDetailRequestDealQuote } from './actions';

import { getUserLocation } from 'apps/user/selectors';
import { getLeaseAnnualMileage, getLeaseTerm } from './selectors';
import AddToCart from './components/AddToCart';

import { dealType } from 'types';

class DealDetailContainer extends React.PureComponent {
    static propTypes = {
        deal: dealType,
        purchaseStrategy: PropTypes.string.isRequired,
        userLocation: PropTypes.object.isRequired,
        dealPricing: PropTypes.object,
        discountType: PropTypes.string.isRequired,
        selectedConditionalRoles: PropTypes.array,
        compareList: PropTypes.array,
        initPage: PropTypes.func.isRequired,
        receiveDeal: PropTypes.func.isRequired,
        setPurchaseStrategy: PropTypes.func.isRequired,
        dealDetailRequestDealQuote: PropTypes.func.isRequired,
        setCheckoutData: PropTypes.func.isRequired,
        checkoutStart: PropTypes.func.isRequired,
    };

    state = {
        featuredImage: [],
        fuelExternalImages: [],
        fuelInternalImages: [],
        basicFeatures: [],
        fuelEconomy: {},
        upholsteryType: null,
        warranties: null,
        dimensions: null,
        showStandardFeatures: false,
        showFeatures: false,
    };

    componentDidMount() {
        this.props.receiveDeal(this.props.deal);
        this.props.initPage();

        if (this.props.deal.photos.length) {
            this.setState({ featuredImage: this.props.deal.photos[0] });
        }

        if (this.props.deal.dmr_features.length) {
            const upholsteryType = this.props.deal.dmr_features.find(
                feature => {
                    return feature.slug.includes('seat_main_upholstery_');
                }
            ).title;

            this.setState({ upholsteryType });
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

        ApiClient.deal.dealGetDimensions(this.props.deal.id).then(response => {
            this.setState({
                dimensions: response.data,
            });
        });

        ApiClient.deal.dealGetWarranties(this.props.deal.id).then(response => {
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
                onClose={() => {
                    this.hideModals();
                }}
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

                        <ul>
                            {this.state.basicFeatures ? (
                                this.state.basicFeatures.map(
                                    (feature, index) => {
                                        return (
                                            <li key={index}>
                                                {feature.name}:{' '}
                                                {feature.content}
                                            </li>
                                        );
                                    }
                                )
                            ) : (
                                <SVGInline svg={miscicons['loading']} />
                            )}

                            {this.state.fuelEconomy ? (
                                <li>
                                    Fuel Economy - City:{' '}
                                    {this.state.fuelEconomy.city} Highway:{' '}
                                    {this.state.fuelEconomy.highway}
                                </li>
                            ) : (
                                <SVGInline svg={miscicons['loading']} />
                            )}
                        </ul>

                        <h4>Dimensions</h4>
                        <ul>
                            {this.state.dimensions ? (
                                this.state.dimensions.map(
                                    (dimension, index) => {
                                        return (
                                            <li key={index}>
                                                {dimension.feature}:{' '}
                                                {dimension.content}
                                            </li>
                                        );
                                    }
                                )
                            ) : (
                                <SVGInline svg={miscicons['loading']} />
                            )}
                        </ul>

                        <h4>Warranties</h4>
                        <ul>
                            {this.state.warranties ? (
                                this.state.warranties.map(
                                    (dimension, index) => {
                                        return (
                                            <li key={index}>
                                                {dimension.feature}:{' '}
                                                {dimension.content}
                                            </li>
                                        );
                                    }
                                )
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
                onClose={() => {
                    this.hideModals();
                }}
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

    handleBuyNow = e => {
        const dealPricing = this.props.dealPricing;

        this.props.setCheckoutData(
            dealPricing.deal(),
            dealPricing.quote(),
            dealPricing.paymentStrategy(),
            dealPricing.discountType(),
            dealPricing.effectiveTermValue(),
            dealPricing.financeDownPaymentValue(),
            dealPricing.leaseAnnualMileageValue(),
            dealPricing.data.employeeBrand,
            dealPricing.data.supplierBrand
        );

        this.props.checkoutStart(dealPricing);
    };

    handlePaymentTypeChange = strategy => {
        this.props.setPurchaseStrategy(strategy);
        this.props.dealDetailRequestDealQuote(
            this.props.deal,
            this.props.userLocation.zipcode,
            strategy,
            this.props.discountType
        );
    };

    handleDiscountChange = (discountType, make) => {
        switch (discountType) {
            case 'dmr':
                this.props.selectDiscountActions.selectDmrDiscount();
                break;

            case 'employee':
                this.props.selectDiscountActions.selectEmployeeDiscount(make);
                break;

            case 'supplier':
                this.props.selectDiscountActions.selectSupplierDiscount(make);
                break;
        }

        this.props.dealDetailRequestDealQuote(
            this.props.deal,
            this.props.userLocation.zipcode,
            this.props.purchaseStrategy,
            discountType
        );
    };

    handleRebatesChange = role => {
        let selectedRoles = this.props.selectedConditionalRoles;
        let index = selectedRoles.indexOf(role);
        if (index !== -1) {
            selectedRoles.splice(index, 1);
        } else {
            selectedRoles.push(role);
        }

        this.props.selectDiscountActions.selectConditionalRoles(selectedRoles);

        this.props.dealDetailRequestDealQuote(
            this.props.deal,
            this.props.userLocation.zipcode,
            this.props.purchaseStrategy,
            this.props.discountType,
            selectedRoles
        );
    };

    handleFinanceDownPaymentChange = downPayment => {
        this.props.financeActions.updateDownPayment(downPayment);
    };

    handleFinanceTermChange = term => {
        this.props.financeActions.updateTerm(term);
    };

    handleLeaseTermChange = term => {
        this.props.leaseActions.updateTerm(term);
    };

    handleLeaseAnnualMileageChange = annualMileage => {
        this.props.leaseActions.updateAnnualMileage(annualMileage);
    };

    handleLeaseCashDueChange = cashDue => {
        this.props.leaseActions.updateCashDue(cashDue);
    };

    handleLeaseChange = (annualMileage, term, cashDue) => {
        this.props.leaseActions.update(annualMileage, term, cashDue);
    };

    renderFeaturesAndOptions(deal) {
        return (
            <div className="deal-details__deal-content">
                <div className="deal-details__deal-content-header">
                    <div className="deal-details__deal-content-at-a-glance">
                        This Vehicle At-A-Glance
                    </div>
                    <div className="deal-details__deal-content-color">
                        {deal.color} Exterior, {deal.interior_color}{' '}
                        {this.state.upholsteryType} Interior
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
                            onClick={() => this.showStandardFeatures()}
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
                                onClick={e => this.showFeatures(e)}
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
            <div>
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
                        </Col>
                        <Col md="6" lg="4">
                            <AddToCart
                                deal={this.props.deal}
                                purchaseStrategy={this.props.purchaseStrategy}
                                handlePaymentTypeChange={this.handlePaymentTypeChange.bind(
                                    this
                                )}
                                dealPricing={this.props.dealPricing}
                                handleDiscountChange={this.handleDiscountChange.bind(
                                    this
                                )}
                                handleRebatesChange={this.handleRebatesChange.bind(
                                    this
                                )}
                                handleFinanceDownPaymentChange={this.handleFinanceDownPaymentChange.bind(
                                    this
                                )}
                                handleFinanceTermChange={this.handleFinanceTermChange.bind(
                                    this
                                )}
                                handleLeaseTermChange={this.handleLeaseTermChange.bind(
                                    this
                                )}
                                handleLeaseCashDueChange={this.handleLeaseCashDueChange.bind(
                                    this
                                )}
                                handleLeaseAnnualMileageChange={this.handleLeaseAnnualMileageChange.bind(
                                    this
                                )}
                                handleLeaseChange={this.handleLeaseChange.bind(
                                    this
                                )}
                                handleBuyNow={this.handleBuyNow.bind(this)}
                                onToggleCompare={
                                    this.props.legacyActions.toggleCompare
                                }
                                compareList={this.props.compareList}
                            />
                        </Col>
                    </Row>

                    {this.state.showStandardFeatures
                        ? this.renderStandardFeaturesModal(this.props.deal)
                        : ''}
                    {this.state.showFeatures
                        ? this.renderFeaturesModal(this.props.deal)
                        : ''}
                </Container>
                <CompareBar class="compare-bar compare-bar--static" />
            </div>
        );
    }
}

const mapStateToProps = (state, props) => {
    return {
        selectedConditionalRoles:
            state.pages.dealDetails.selectDiscount.conditionalRoles,
        purchaseStrategy: state.user.purchasePreferences.strategy,
        compareList: state.common.compareList,
        financeDownPayment: state.pages.dealDetails.finance.downPayment,
        financeTerm: state.pages.dealDetails.finance.term,
        leaseAnnualMileage: getLeaseAnnualMileage(state),
        leaseTerm: getLeaseTerm(state),
        fallbackDealImage: state.common.fallbackDealImage,
        selectedDeal: state.common.selectedDeal,
        discountType: state.pages.dealDetails.selectDiscount.discountType,
        dealPricing: dealPricingFactory(state, props),
        window: state.common.window,
        userLocation: getUserLocation(state),
    };
};

const mapDispatchToProps = mapAndBindActionCreators({
    financeActions,
    leaseActions,
    selectDiscountActions,
    legacyActions,
    initPage,
    setPurchaseStrategy,
    receiveDeal,
    dealDetailRequestDealQuote,
    setCheckoutData,
    checkoutStart,
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(DealDetailContainer);
