import React from 'react';
import R from 'ramda';
import { connect } from 'react-redux';
import * as Actions from 'actions/index';
import util from 'src/util';

class DealDetails extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            featuredImage: props.deal.photos.data[0],
            selectedTab: 'cash',
        };

        this.renderThumbnailImage = this.renderThumbnailImage.bind(this);
        this.renderLoginRegister = this.renderLoginRegister.bind(this);
        this.selectCashTab = this.selectCashTab.bind(this);
        this.selectFinanceTab = this.selectFinanceTab.bind(this);
        this.selectLeaseTab = this.selectLeaseTab.bind(this);
        this.renderDMRPrice = this.renderDMRPrice.bind(this);
        this.renderCompareAndBuyNow = this.renderCompareAndBuyNow.bind(this);
        this.startPurchaseFlow = this.startPurchaseFlow.bind(this);
    }

    componentDidMount() {
        this.props.requestFuelImages(this.props.deal);
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
                        href="/login?intended=filter"
                    >
                        Login
                    </a>
                    <a
                        className="deal-details__button deal-details__button--small deal-details__button--blue deal-details__button--capitalize"
                        href="/register?intended=filter"
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
            this.props.deal.photos.data,
            R.concat(
                this.props.fuelExternalImages,
                this.props.fuelInternalImages
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
                src={R.propOr(this.props.fallbackDealImage, 'url', photo)}
            />
        );
    }

    renderFeaturedImage() {
        return (
            <img
                className="deal-details__primary-image"
                src={R.propOr(
                    this.props.fallbackDealImage,
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
        const deal = this.props.deal;

        return (
            <div className="deal-details__dmr-price">
                <div className="deal-details__dmr-price-label">
                    Your DMR Price:
                </div>
                <div className="deal-details__dmr-price-amount">
                    {util.moneyFormat(deal.price)}
                </div>
            </div>
        );
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

        let deal_id = document.createElement('input');
        deal_id.setAttribute('name', 'deal_id');
        deal_id.setAttribute('value', deal.id);

        [
            {
                name: 'Example incentive',
                value: 500.50,
            },
        ].forEach((incentive, index) => {
            let incentiveName = document.createElement('input');
            incentiveName.setAttribute('name', `incentives[${index}][name]`);
            incentiveName.setAttribute('value', incentive.name);
            form.appendChild(incentiveName);

            let incentiveValue = document.createElement('input');
            incentiveValue.setAttribute('name', `incentives[${index}][value]`);
            incentiveValue.setAttribute('value', incentive.value);
            form.appendChild(incentiveValue);
        });

        let dmr_price = document.createElement('input');
        dmr_price.setAttribute('name', 'dmr_price');
        dmr_price.setAttribute('value', deal.price);

        form.appendChild(csrf);
        form.appendChild(deal_id);
        form.appendChild(dmr_price);

        document.body.appendChild(form);
        form.submit();
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

                    <div className="deal-details__pricing-body">
                        <div className="deal-details__msrp">
                            MSRP
                            <span className="deal-details__msrp-amount">
                                {util.moneyFormat(deal.msrp)}
                            </span>
                        </div>

                        {window.user ? this.renderDMRPrice() : ''}

                        {window.user ? this.renderCompareAndBuyNow() : ''}

                        {!window.user ? this.renderLoginRegister() : ''}
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        deal: state.selectedDeal,
        fallbackDealImage: state.fallbackDealImage,
        fuelExternalImages: state.fuelExternalImages,
        fuelInternalImages: state.fuelInternalImages,
        compareList: state.compareList,
    };
};

export default connect(mapStateToProps, Actions)(DealDetails);
