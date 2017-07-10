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
        };

        this.renderThumbnailImage = this.renderThumbnailImage.bind(this);
        this.renderLoginRegister = this.renderLoginRegister.bind(this);
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

    render() {
        const deal = this.props.deal;
        const settings = {
            accessibility: true,
            infinite: false,
            lazyLoad: false,
            focusOnSelect: false,
            slidesToShow: 4,
            slidesToScroll: 4,
        };

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
                    <div>Pricing</div>
                    <div>
                        cash / finance / lease
                    </div>

                    <div>MSRP: {util.moneyFormat(deal.msrp)}</div>

                    {window.user
                        ? <p>DMR Price: {util.moneyFormat(deal.price)}</p>
                        : this.renderLoginRegister()}
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
    };
};

export default connect(mapStateToProps, Actions)(DealDetails);
