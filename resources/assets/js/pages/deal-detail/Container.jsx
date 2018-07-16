import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import R from 'ramda';

import * as legacyActions from 'apps/common/actions';

import strings from 'src/strings';
import util from 'src/util';

import CompareBar from 'components/CompareBar';
import Modal from 'components/Modal';
import miscicons from 'miscicons';
import SVGInline from 'react-svg-inline';
import zondicons from 'zondicons';

import ImageGallery from 'react-image-gallery';
import { dealPricingFactory } from 'src/DealPricing';

import CashPricingPane from './components/pricing/CashPane';
import FinancePricingPane from './components/pricing/FinancePane';
import LeasePricingPane from './components/pricing/LeasePane';
import PaymentTypes from './components/pricing/PaymentTypes';
import Line from '../../components/pricing/Line';

import mapAndBindActionCreators from 'util/mapAndBindActionCreators';
import { setPurchaseStrategy } from 'apps/user/actions';
import { setCheckoutData } from 'apps/checkout/actions';
import * as selectDiscountActions from './modules/selectDiscount';
import * as financeActions from './modules/finance';
import * as leaseActions from './modules/lease';
import { dealDetailRequestDealQuote } from './actions';
import { initPage, receiveDeal } from './actions';

import { getUserLocation } from 'apps/user/selectors';
import { getLeaseAnnualMileage, getLeaseTerm } from './selectors';
import ApiClient from '../../store/api';

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
        purchaseStrategy: PropTypes.string.isRequired,
        userLocation: PropTypes.object.isRequired,
        discountType: PropTypes.string.isRequired,
        selectedConditionalRoles: PropTypes.array,

        initPage: PropTypes.func.isRequired,
        receiveDeal: PropTypes.func.isRequired,
        setPurchaseStrategy: PropTypes.func.isRequired,
        dealDetailRequestDealQuote: PropTypes.func.isRequired,
        setCheckoutData: PropTypes.func.isRequired,
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

        if (this.props.deal.version) {
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
        }

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

    renderDeal(deal, { shouldRenderStockNumber } = {}) {
        const { purchaseStrategy, dealPricing } = this.props;

        return (
            <div className="deal-details__pricing">
                <div>
                    {shouldRenderStockNumber && (
                        <div className="deal-details__stock-number">
                            Stock# {this.props.deal.stock_number}
                        </div>
                    )}
                    <div className="info-modal-data">
                        <div className="info-modal-data__price">
                            <PaymentTypes
                                {...{ purchaseStrategy }}
                                onChange={this.handlePaymentTypeChange}
                            />
                            {this.props.purchaseStrategy === 'cash' && (
                                <CashPricingPane
                                    {...{ dealPricing }}
                                    onDiscountChange={this.handleDiscountChange}
                                    onRebatesChange={this.handleRebatesChange}
                                />
                            )}
                            {this.props.purchaseStrategy === 'finance' && (
                                <FinancePricingPane
                                    {...{ dealPricing }}
                                    onDiscountChange={this.handleDiscountChange}
                                    onRebatesChange={this.handleRebatesChange}
                                    onDownPaymentChange={
                                        this.handleFinanceDownPaymentChange
                                    }
                                    onTermChange={this.handleFinanceTermChange}
                                />
                            )}
                            {this.props.purchaseStrategy === 'lease' && (
                                <LeasePricingPane
                                    {...{ dealPricing }}
                                    onDiscountChange={this.handleDiscountChange}
                                    onRebatesChange={this.handleRebatesChange}
                                    onTermChange={this.handleLeaseTermChange}
                                    onAnnualMileageChange={
                                        this.handleLeaseAnnualMileageChange
                                    }
                                    onCashDueChange={
                                        this.handleLeaseCashDueChange
                                    }
                                    onChange={this.handleLeaseChange}
                                />
                            )}
                            <div className="deal__buttons">
                                <button
                                    className={this.compareButtonClass()}
                                    onClick={this.props.legacyActions.toggleCompare.bind(
                                        null,
                                        this.props.dealPricing.deal()
                                    )}
                                >
                                    {this.isAlreadyInCompareList()
                                        ? 'Remove from compare'
                                        : 'Compare'}
                                </button>

                                <button
                                    className="deal__button deal__button--small deal__button--pink deal__button"
                                    onClick={this.handleBuyNow}
                                    disabled={
                                        !this.props.dealPricing.canPurchase()
                                    }
                                >
                                    Buy Now
                                </button>
                            </div>
                            <Line>
                                <div
                                    style={{
                                        fontStyle: 'italic',
                                        fontSize: '.75em',
                                        marginLeft: '.25em',
                                    }}
                                >
                                    * includes all taxes and dealer fees
                                </div>
                            </Line>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    handleBuyNow = () => {
        this.props.setCheckoutData(
            this.props.dealPricing.data.deal,
            this.props.dealPricing.data.dealQuote,
            this.props.dealPricing.data.paymentType,
            this.props.dealPricing.data.discountType,
            this.props.dealPricing.data.paymentType === 'lease'
                ? this.props.dealPricing.leaseTermValue()
                : this.props.dealPricing.financeTermValue(),
            this.props.dealPricing.financeDownPaymentValue(),
            this.props.dealPricing.leaseAnnualMileageValue(),
            this.props.dealPricing.data.employeeBrand,
            this.props.dealPricing.data.supplierBrand
        );

        window.location = `/confirm/${this.props.dealPricing.id()}`;
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

    renderStockNumber() {
        return (
            <div className="deal-details__stock-number">
                Stock# {this.props.deal.stock_number}
            </div>
        );
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
                            onClick={e => this.showFeatures(e)}
                        >
                            See all additional options &gt;
                        </a>
                    </div>
                </div>
            </div>
        );
    }

    render() {
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
                            {util.windowIsLargerThanSmall(
                                this.props.window.width
                            )
                                ? null
                                : this.renderStockNumber()}
                        </div>
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
                        {util.windowIsLargerThanSmall(this.props.window.width)
                            ? null
                            : this.renderDeal(this.props.deal, {
                                  shouldRenderStockNumber: false,
                              })}
                        {this.renderFeaturesAndOptions(this.props.deal)}
                    </div>
                    {util.windowIsLargerThanSmall(this.props.window.width)
                        ? this.renderDeal(this.props.deal, {
                              shouldRenderStockNumber: true,
                          })
                        : null}
                </div>

                <CompareBar class="compare-bar compare-bar--static" />

                {this.state.showStandardFeatures
                    ? this.renderStandardFeaturesModal(this.props.deal)
                    : ''}
                {this.state.showFeatures
                    ? this.renderFeaturesModal(this.props.deal)
                    : ''}
            </div>
        );
    }

    isAlreadyInCompareList() {
        return R.contains(
            this.props.dealPricing.deal(),
            R.map(R.prop('deal'), this.props.compareList)
        );
    }

    compareButtonClass() {
        return (
            'deal__button deal__button--small deal__button--blue' +
            (this.isAlreadyInCompareList() ? 'deal__button--blue' : '')
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
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Container);
