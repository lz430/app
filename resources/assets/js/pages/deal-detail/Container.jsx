import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import * as legacyActions from 'apps/common/actions';
import api from 'src/api';
import CompareBar from 'components/CompareBar';
import Modal from 'components/Modal';
import miscicons from 'miscicons';
import R from 'ramda';

import strings from 'src/strings';
import SVGInline from 'react-svg-inline';
import zondicons from 'zondicons';
import ImageGallery from 'react-image-gallery';
import AccuPricingModal from 'components/AccuPricingModal';
import DealPricing from 'src/DealPricing';
import { makeDealPricing } from 'apps/common/selectors';
import util from 'src/util';
import CashPricingPane from './components/pricing/CashPane';
import FinancePricingPane from './components/pricing/FinancePane';
import LeasePricingPane from './components/pricing/LeasePane';
import PaymentTypes from './components/pricing/PaymentTypes';
import Line from './components/pricing/Line';

import mapAndBindActionCreators from 'util/mapAndBindActionCreators';
import { setPurchaseStrategy } from 'apps/user/actions';
import { requestDealQuote } from 'apps/pricing/actions';
import * as selectDiscountActions from './modules/selectDiscount';
import * as financeActions from './modules/finance';
import * as leaseActions from './modules/lease';

import { initPage, receiveDeal } from './actions';

import { getActiveQuote } from './selectors';
import { getUserLocation } from 'apps/user/selectors';

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
        initPage: PropTypes.func.isRequired,
        receiveDeal: PropTypes.func.isRequired,
        setPurchaseStrategy: PropTypes.func.isRequired,
        requestDealQuote: PropTypes.func.isRequired,
    };
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
        this.props.receiveDeal(this.props.deal);
        this.props.initPage();

        this.props.legacyActions.requestBestOffer(this.props.deal);

        if (this.props.deal.photos.length) {
            this.setState({ featuredImage: this.props.deal.photos[0] });
        }

        api.getDimensions(this.props.deal.version.jato_vehicle_id).then(
            response => {
                if (!this._isMounted) return;

                this.setState({
                    dimensions: response.data,
                });
            }
        );

        api.getWarranties(this.props.deal.version.jato_vehicle_id).then(
            response => {
                if (!this._isMounted) return;

                this.setState({
                    warranties: response.data,
                });
            }
        );
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
                                    onClick={() =>
                                        (window.location = `/confirm/${dealPricing.id()}`)
                                    }
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
        window.location = '/deal/';
    };

    handlePaymentTypeChange = strategy => {
        this.props.setPurchaseStrategy(strategy);
        this.props.requestDealQuote(
            this.props.deal,
            this.props.userLocation.zipcode,
            strategy
        );
        //this.props.legacyActions.requestBestOffer(this.props.deal);
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
    };

    handleRebatesChange = () => {
        this.props.legacyActions.requestBestOffer(this.props.deal);
    };

    handleFinanceDownPaymentChange = downPayment => {
        this.props.financeActions.updateDownPayment(downPayment);
    };

    handleFinanceTermChange = term => {
        this.props.financeActions.updateTerm(term);
    };

    handleLeaseTermChange = term => {
        const { dealPricing } = this.props;

        this.props.leaseActions.updateTerm(
            dealPricing.id(),
            dealPricing.zipcode(),
            term
        );
    };

    handleLeaseAnnualMileageChange = annualMileage => {
        const { dealPricing } = this.props;

        this.props.leaseActions.updateAnnualMileage(
            dealPricing.id(),
            dealPricing.zipcode(),
            annualMileage
        );
    };

    handleLeaseCashDueChange = cashDue => {
        const { dealPricing } = this.props;

        this.props.leaseActions.updateCashDue(
            dealPricing.id(),
            dealPricing.zipcode(),
            cashDue
        );
    };

    handleLeaseChange = (annualMileage, term, cashDue) => {
        const { dealPricing } = this.props;

        this.props.leaseActions.update(
            dealPricing.id(),
            dealPricing.zipcode(),
            annualMileage,
            term,
            cashDue
        );
    };

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
                <AccuPricingModal />
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

function mapStateToProps(state) {
    const getDealPricing = makeDealPricing();
    return (state, props) => {
        return {
            purchaseStrategy: state.user.purchasePreferences.strategy,
            quote: getActiveQuote(state),
            compareList: state.common.compareList,
            downPayment: state.common.downPayment,
            termDuration: state.common.termDuration,
            fallbackDealImage: state.common.fallbackDealImage,
            selectedDeal: state.common.selectedDeal,
            employeeBrand: state.common.employeeBrand,
            dealPricing: new DealPricing(getDealPricing(state, props)),
            window: state.common.window,
            userLocation: getUserLocation(state),
        };
    };
}

const mapDispatchToProps = mapAndBindActionCreators({
    financeActions,
    leaseActions,
    selectDiscountActions,
    legacyActions,
    initPage,
    setPurchaseStrategy,
    receiveDeal,
    requestDealQuote,
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Container);
