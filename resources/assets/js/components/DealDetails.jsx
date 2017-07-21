import React from 'react';
import PropTypes from 'prop-types';
import R from 'ramda';
import { connect } from 'react-redux';
import * as Actions from 'actions/index';
import util from 'src/util';
import fuelapi from 'src/fuelapi';
import fuelcolor from 'src/fuel-color-map';
import api from 'src/api';
import SVGInline from 'react-svg-inline';
import zondicons from 'zondicons';
import { toggleRebate } from 'src/rebates';
import Lease from 'components/Lease';
import debounce from 'lodash.debounce';
import Finance from './Finance';

class DealDetails extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            featuredImage: props.deal.photos[0],
            fuelExternalImages: [],
            fuelInternalImages: [],
            selectedTab: 'cash',
            fallbackDealImage: '/images/dmr-logo.svg',
            available_rebates: null,
            compatibilities: null,
            // Tab Rebate States
            compatible_rebate_ids_cash: null,
            compatible_rebate_ids_finance: null,
            compatible_rebate_ids_lease: null,
            selected_rebate_ids_cash: [],
            selected_rebate_ids_finance: [],
            selected_rebate_ids_lease: [],
            // Lease Tab Specific States
            lease_annual_mileage: 15000,
            lease_down_payment: 0,
            lease_terms: null,
            lease_term: null,
            lease_selected_term: null,
            // Finance Tab Specific States
            finance_down_payment: 0,
            finance_terms: null,
            finance_term: null,
            finance_selected_term: null,
        };

        this.renderThumbnailImage = this.renderThumbnailImage.bind(this);
        this.renderLoginRegister = this.renderLoginRegister.bind(this);
        this.selectCashTab = this.selectCashTab.bind(this);
        this.selectFinanceTab = this.selectFinanceTab.bind(this);
        this.selectLeaseTab = this.selectLeaseTab.bind(this);
        this.renderDMRPrice = this.renderDMRPrice.bind(this);
        this.renderYourDMRPrice = this.renderYourDMRPrice.bind(this);
        this.renderCompareAndBuyNow = this.renderCompareAndBuyNow.bind(this);
        this.startPurchaseFlow = this.startPurchaseFlow.bind(this);
        this.requestFuelImages = this.requestFuelImages.bind(this);
        this.requestRebates = this.requestRebates.bind(this);
        this.renderRebates = this.renderRebates.bind(this);
        this.renderRebate = this.renderRebate.bind(this);
        this.renderSelectedTab = this.renderSelectedTab.bind(this);
        this.toggleRebate = this.toggleRebate.bind(this);
        this.getDMRPriceAfterRebates = this.getDMRPriceAfterRebates.bind(this);
        this.updateLeaseTerm = this.updateLeaseTerm.bind(this);
        this.updateLeaseAnnualMileage = this.updateLeaseAnnualMileage.bind(
            this
        );
        this.updateLeaseDownPayment = this.updateLeaseDownPayment.bind(this);
        this.updateFinanceTerm = this.updateFinanceTerm.bind(this);
        this.updateFinanceDownPayment = this.updateFinanceDownPayment.bind(
            this
        );
        this.debouncedRequestLeaseTerms = debounce(this.requestLeaseTerms, 500);
        this.debouncedRequestFinanceTerms = debounce(
            this.requestFinanceTerms,
            500
        );
    }

    componentDidMount() {
        this.requestFuelImages(this.props.deal);

        if (this.props.zipcode) {
            this.requestRebates();
            this.requestFinanceTerms(this.props.deal);
            this.requestLeaseTerms(this.props.deal);
        }
    }

    requestLeaseTerms() {
        api
            .getLeaseTerms(
                this.props.deal.vin,
                this.props.zipcode,
                this.state.lease_annual_mileage,
                this.state.lease_down_payment,
                this.props.deal.msrp,
                this.getDMRPriceAfterRebates()
            )
            .then(response => {
                this.setState({
                    lease_terms: response.data,
                    lease_term: R.propOr(null, 'term', response.data[0]),
                    lease_selected_term: response.data[0]
                        ? response.data[0]
                        : null,
                });
            });
    }

    requestFinanceTerms() {
        api
            .getFinanceTerms(
                this.props.deal.vin,
                this.props.zipcode,
                this.state.finance_down_payment,
                this.props.deal.msrp,
                this.getDMRPriceAfterRebates()
            )
            .then(response => {
                this.setState({
                    finance_terms: response.data,
                    finance_term: R.propOr(null, 'term', response.data[0]),
                    finance_selected_term: response.data[0]
                        ? response.data[0]
                        : null,
                });
            });
    }

    toggleRebate(rebate_id) {
        const [next_selected_rebate_ids, available_rebate_ids] = toggleRebate(
            rebate_id,
            this.state[`selected_rebate_ids_${this.state.selectedTab}`],
            R.map(R.prop('id'), this.state.available_rebates),
            this.state.compatibilities
        );

        this.setState(
            {
                lease_selected_term: null,
                lease_terms: null,
                [`selected_rebate_ids_${this.state.selectedTab}`]: next_selected_rebate_ids,
                [`compatible_rebate_ids_${this.state.selectedTab}`]: available_rebate_ids,
            },
            this.debouncedRequestLeaseTerms
        );
    }

    requestRebates() {
        api
            .getRebates(this.props.zipcode, this.props.deal.vin, [])
            .then(response => {
                const rebate_ids = R.map(R.prop('id'), response.data.rebates);

                this.setState({
                    available_rebates: response.data.rebates,
                    compatibilities: response.data.compatibilities,
                    compatible_rebate_ids_cash: rebate_ids,
                    compatible_rebate_ids_finance: rebate_ids,
                    compatible_rebate_ids_lease: rebate_ids,
                });
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

    renderLoginRegister() {
        return (
            <div className="deal-details__login-register">
                <div className="deal-details__login-register-text">
                    Get the best value from
                    {' '}
                    <em>Deliver My Ride</em>
                    . Login or Register to see the best price for you!
                </div>
                <div className="deal-details__login-register-buttons">
                    <a
                        className="deal-details__button deal-details__button--small deal-details__button--blue deal-details__button--capitalize"
                        href={`/login?intended=${this.props.intendedRoute}`}
                    >
                        Login
                    </a>
                    <a
                        className="deal-details__button deal-details__button--small deal-details__button--blue deal-details__button--capitalize"
                        href={`/register?intended=${this.props.intendedRoute}`}
                    >
                        Register
                    </a>
                </div>
            </div>
        );
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

    renderThumbnailImage(photo, index) {
        const imageClass =
            'deal-details__thumbnail-image ' +
            (R.contains('fuel', photo.id)
                ? 'deal-details__thumbnail-image--from-fuel '
                : '') +
            (this.state.featuredImage.url === photo.url
                ? 'deal-details__thumbnail-image--selected'
                : '');

        return (
            <img
                key={index}
                onClick={this.selectFeaturedImage.bind(this, index)}
                className={imageClass}
                src={R.propOr(this.state.fallbackDealImage, 'url', photo)}
            />
        );
    }

    renderFeaturedImage() {
        return (
            <img
                className="deal-details__primary-image"
                src={R.propOr(
                    this.state.fallbackDealImage,
                    'url',
                    this.state.featuredImage
                )}
            />
        );
    }

    selectCashTab() {
        this.setState({
            selectedTab: 'cash',
        });
    }

    selectFinanceTab() {
        this.setState({
            selectedTab: 'finance',
        });
    }

    selectLeaseTab() {
        this.setState({
            selectedTab: 'lease',
        });
    }

    renderDMRPrice() {
        return (
            <div className="deal-details__dmr-price">
                <div className="deal-details__dmr-price-label">
                    DMR Price:
                </div>
                <div className="deal-details__dmr-price-amount">
                    {util.moneyFormat(this.props.deal.price)}
                </div>
            </div>
        );
    }

    getRebates() {
        return R.filter(rebate => {
            return R.contains(this.state.selectedTab, rebate.types);
        }, this.state.available_rebates);
    }

    getSelectedRebates() {
        return R.filter(rebate => {
            return R.contains(
                rebate.id,
                this.state[`selected_rebate_ids_${this.state.selectedTab}`]
            );
        }, this.state.available_rebates ? this.state.available_rebates : []);
    }

    getDMRPriceAfterRebates() {
        const totalRebateAmount = R.compose(R.sum, R.map(R.prop('value')))(
            this.getSelectedRebates()
        );

        return this.props.deal.price - totalRebateAmount;
    }

    renderYourDMRPrice() {
        return (
            <div className="deal-details__your-dmr-price">
                <div className="deal-details__your-dmr-price-label">
                    Your DMR Price:
                </div>
                <div className="deal-details__your-dmr-price-amount">
                    <div>
                        {util.moneyFormat(this.getDMRPriceAfterRebates())}
                    </div>
                    <div className="deal-details__your-dmr-price-extra">
                        {this.renderYourDMRPriceExtra()}
                    </div>
                </div>
            </div>
        );
    }

    renderYourDMRPriceExtra() {
        switch (this.state.selectedTab) {
            case 'finance':
                switch (String(this.state.finance_terms)) {
                    case 'null':
                        return 'loading';
                    case '':
                        return 'no terms available';
                    default:
                        switch (this.state.finance_selected_term) {
                            case null:
                                return 'loading';
                            default:
                                return `at ${util.moneyFormat(this.state.finance_selected_term.payment)} / month`;
                        }
                }
            case 'lease':
                switch (String(this.state.lease_terms)) {
                    case 'null':
                        return 'loading';
                    case '':
                        return 'no terms available';
                    default:
                        switch (this.state.lease_selected_term) {
                            case null:
                                return 'loading';
                            default:
                                return `at ${util.moneyFormat(this.state.lease_selected_term.payment)} / month`;
                        }
                }
        }
    }

    renderCompareAndBuyNow() {
        const deal = this.props.deal;
        const isBeingCompared = R.contains(deal, this.props.compareList);
        const compareClass = `deal-details__dmr-button deal-details__dmr-button--small deal-details__dmr-button--${isBeingCompared ? 'blue' : 'white'}`;

        return (
            <div className="deal-details__dmr-buttons">
                <button
                    className={compareClass}
                    onClick={this.props.toggleCompare.bind(null, deal)}
                >
                    Compare
                </button>
                <button
                    type="button"
                    onClick={this.startPurchaseFlow}
                    className="deal-details__dmr-button deal-details__dmr-button--blue deal-details__dmr-button--small"
                >
                    Buy Now
                </button>
            </div>
        );
    }

    startPurchaseFlow() {
        const deal = this.props.deal;

        let form = document.createElement('form');
        form.setAttribute('method', 'post');
        form.setAttribute('action', '/apply-or-purchase');

        let csrf = document.createElement('input');
        csrf.setAttribute('name', '_token');
        csrf.setAttribute('value', window.Laravel.csrfToken);
        form.appendChild(csrf);

        let type = document.createElement('input');
        type.setAttribute('name', 'type');
        type.setAttribute('value', this.state.selectedTab);
        form.appendChild(type);

        if (this.state.selectedTab !== 'cash') {
            let amount_financed = document.createElement('input');
            amount_financed.setAttribute('name', 'amount_financed');
            amount_financed.setAttribute(
                'value',
                this.state[`${this.state.selectedTab}_selected_term`]
                    .amount_financed
            );
            form.appendChild(amount_financed);

            let term = document.createElement('input');
            term.setAttribute('name', 'term');
            term.setAttribute(
                'value',
                this.state[`${this.state.selectedTab}_selected_term`].term
            );
            form.appendChild(term);
        }

        let deal_id = document.createElement('input');
        deal_id.setAttribute('name', 'deal_id');
        deal_id.setAttribute('value', deal.id);
        form.appendChild(deal_id);

        this.getSelectedRebates().forEach((rebate, index) => {
            let rebateName = document.createElement('input');
            rebateName.setAttribute('name', `rebates[${index}][rebate]`);
            rebateName.setAttribute('value', rebate.rebate);
            form.appendChild(rebateName);

            let rebateValue = document.createElement('input');
            rebateValue.setAttribute('name', `rebates[${index}][value]`);
            rebateValue.setAttribute('value', rebate.value);
            form.appendChild(rebateValue);
        });

        let msrp = document.createElement('input');
        msrp.setAttribute('name', 'msrp');
        msrp.setAttribute('value', this.props.deal.msrp);
        form.appendChild(msrp);

        let dmr_price = document.createElement('input');
        dmr_price.setAttribute('name', 'dmr_price');
        dmr_price.setAttribute('value', this.getDMRPriceAfterRebates());
        form.appendChild(dmr_price);

        document.body.appendChild(form);
        form.submit();
    }

    renderRebate(rebate, index) {
        const isSelected = R.contains(rebate, this.getSelectedRebates());
        const isSelectable = R.contains(
            rebate.id,
            this.state[`compatible_rebate_ids_${this.state.selectedTab}`]
        );
        const checkboxClass = `deal-details__rebate-checkbox deal-details__rebate-checkbox--inverted ${isSelected ? 'deal-details__rebate-checkbox--selected' : ''}`;

        return (
            <div
                onClick={
                    isSelectable
                        ? this.toggleRebate.bind(this, rebate.id)
                        : R.identity
                }
                className={`deal-details__rebate ${isSelectable ? '' : 'deal-details__rebate--disabled'}`}
                key={index}
            >
                {isSelected
                    ? <SVGInline
                          width="15px"
                          height="15px"
                          className={checkboxClass}
                          svg={zondicons['checkmark']}
                      />
                    : <div className="deal-details__rebate-checkbox" />}
                <div className="deal-details__rebate-rebate">
                    {rebate.rebate}
                </div>
                <div className="deal-details__rebate-value">
                    -{util.moneyFormat(rebate.value)}
                </div>
            </div>
        );
    }

    renderRebates() {
        return (
            <div className="deal-details__rebates">
                {this.state.available_rebates
                    ? this.getRebates().map(this.renderRebate)
                    : ''}
            </div>
        );
    }

    updateLeaseTerm(term) {
        this.setState({
            lease_term: term,
            lease_selected_term: R.find(leaseTerm => {
                return leaseTerm.term === term;
            }, this.state.lease_terms),
        });
    }

    updateFinanceTerm(term) {
        this.setState({
            finance_term: term,
            finance_selected_term: R.find(financeTerm => {
                return financeTerm.term === term;
            }, this.state.finance_terms),
        });
    }

    updateLeaseAnnualMileage(annual_mileage) {
        this.setState(
            {
                lease_annual_mileage: annual_mileage,
                lease_selected_term: null,
                lease_terms: null,
            },
            this.debouncedRequestLeaseTerms
        );
    }

    updateLeaseDownPayment(downPayment) {
        this.setState(
            {
                lease_down_payment: downPayment,
                lease_selected_term: null,
                lease_terms: null,
            },
            this.debouncedRequestLeaseTerms
        );
    }

    updateFinanceDownPayment(downPayment) {
        this.setState(
            {
                finance_down_payment: downPayment,
                finance_selected_term: null,
                finance_terms: null,
            },
            this.debouncedRequestFinanceTerms
        );
    }

    renderSelectedTab() {
        switch (this.state.selectedTab) {
            case 'finance':
                return (
                    <Finance
                        financeTerms={this.state.finance_terms}
                        financeTerm={this.state.finance_term}
                        financeDownPayment={this.state.finance_down_payment}
                        updateFinanceDownPayment={this.updateFinanceDownPayment}
                        updateFinanceTerm={this.updateFinanceTerm}
                    />
                );
            case 'lease':
                return (
                    <Lease
                        leaseAnnualMileage={this.state.lease_annual_mileage}
                        leaseTerms={this.state.lease_terms}
                        leaseTerm={this.state.lease_term}
                        leaseDownPayment={this.state.lease_down_payment}
                        updateLeaseAnnualMileage={this.updateLeaseAnnualMileage}
                        updateLeaseDownPayment={this.updateLeaseDownPayment}
                        updateLeaseTerm={this.updateLeaseTerm}
                    />
                );
        }
    }

    render() {
        const deal = this.props.deal;

        return (
            <div className="deal-details">
                <div className="deal-details__images-and-information">
                    <div className="deal-details__images">
                        {this.renderFeaturedImage()}
                        <div className="deal-details__thumbnail-images">
                            {this.allImages().map(this.renderThumbnailImage)}
                        </div>
                    </div>

                    <div className="deal-details__information">
                        <div className="deal-details__title">
                            Vehicle Information
                            <span className="deal-details__vin">
                                {deal.vin.substr(deal.vin.length - 8)}
                            </span>
                        </div>

                        <div className="deal-details__items">
                            <div className="deal-details__item">
                                <div>Color</div>
                                <div>{deal.color}</div>
                            </div>
                            <div className="deal-details__item">
                                <div>Interior Color</div>
                                <div>{deal.interior_color}</div>
                            </div>
                            <div className="deal-details__item">
                                <div>MPG</div>
                                <div>{deal.fuel_econ_hwy}</div>
                            </div>
                            <div className="deal-details__item">
                                <div>Vehicle Type</div>
                                <div>{deal.body}</div>
                            </div>
                            <div className="deal-details__item">
                                <div>Transmission</div>
                                <div>{deal.transmission}</div>
                            </div>
                            <div className="deal-details__item">
                                <div>Fuel Type</div>
                                <div>{deal.fuel}</div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="deal-details__pricing">
                    <div className="deal-details__pricing-title-and-tabs">
                        <div className="deal-details__pricing-title">
                            Pricing
                        </div>
                        <div className="tabs tabs--no-bottom-border">
                            <div
                                className={`tabs__tab ${this.state.selectedTab === 'cash' ? 'tabs__tab--selected' : ''}`}
                                onClick={this.selectCashTab}
                            >
                                Cash
                            </div>
                            <div
                                className={`tabs__tab ${this.state.selectedTab === 'finance' ? 'tabs__tab--selected' : ''}`}
                                onClick={this.selectFinanceTab}
                            >
                                Finance
                            </div>
                            <div
                                className={`tabs__tab ${this.state.selectedTab === 'lease' ? 'tabs__tab--selected' : ''}`}
                                onClick={this.selectLeaseTab}
                            >
                                Lease
                            </div>
                        </div>
                    </div>

                    <div className="deal-details__selected-tab">
                        {this.renderSelectedTab()}
                    </div>

                    <div className="deal-details__pricing-body">
                        <div className="deal-details__msrp">
                            MSRP
                            <span
                                className={`deal-details__msrp-amount ${window.user ? 'deal-details__msrp-amount--strike' : ''}`}
                            >
                                {util.moneyFormat(deal.msrp)}
                            </span>
                        </div>

                        {window.user ? this.renderDMRPrice() : ''}

                        {window.user && this.state.available_rebates
                            ? this.renderRebates()
                            : ''}

                        {window.user && this.state.available_rebates
                            ? this.renderYourDMRPrice()
                            : ''}

                        {window.user ? this.renderCompareAndBuyNow() : ''}

                        {!window.user ? this.renderLoginRegister() : ''}
                    </div>
                </div>
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
    intendedRoute: PropTypes.string.isRequired,
    toggleCompare: PropTypes.func.isRequired,
};

const mapStateToProps = state => {
    return {
        deal: state.selectedDeal,
        compareList: state.compareList,
        zipcode: state.zipcode,
    };
};

const connected = connect(mapStateToProps, Actions)(DealDetails);
const raw = DealDetails;

export { connected, raw };
