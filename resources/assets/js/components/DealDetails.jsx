import React from 'react';
import R from 'ramda';
import { connect } from 'react-redux';
import * as Actions from 'actions/index';
import Slider from 'react-slick';

class DealDetails extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            featuredImage: props.deal.photos.data[0],
        };

        this.renderThumbnailImage = this.renderThumbnailImage.bind(this);
    }

    componentDidMount() {
        this.props.requestFuelImages(this.props.deal);
    }

    selectFeaturedImage(index) {
        this.setState({
            featuredImage: this.allImages()[index],
        });
    }

    allImages() {
        return R.concat(this.props.deal.photos.data, this.props.imagesFromFuel);
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
            <div key={index}><img
                onClick={this.selectFeaturedImage.bind(this, index)}
                className={imageClass}
                src={R.propOr(this.props.fallbackDealImage, 'url', photo)}
            /></div>
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
            slidesToShow: 5,
            slidesToScroll: 5,
        };

        return (
            <div className="deal-details">
                <div className="deal-details__images">
                    {this.renderFeaturedImage()}
                    <Slider {...settings}>
                        {this.allImages().map(this.renderThumbnailImage)}
                    </Slider>
                </div>

                <div className="deal-details__information">
                    <h2>
                        Vehicle Information
                        {' '}
                        <span className="deal-details__vin">
                            {deal.vin.substr(deal.vin.length - 8)}
                        </span>
                    </h2>

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
        );
    }
}

const mapStateToProps = state => {
    return {
        deal: state.selectedDeal,
        fallbackDealImage: state.fallbackDealImage,
        imagesFromFuel: state.imagesFromFuel,
    };
};

export default connect(mapStateToProps, Actions)(DealDetails);
