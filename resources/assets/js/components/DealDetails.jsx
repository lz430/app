import React from 'react';
import R from 'ramda';
import { connect } from 'react-redux';
import * as Actions from 'actions/index';

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
        const photos = this.props.deal.photos.data;
        return (
            <div className="deal-details">
                {this.renderFeaturedImage()}

                <hr />

                <div className="deal-details__thumbnail-images">
                    {this.allImages().map(this.renderThumbnailImage)}
                    {/*{photos.concat(this.props.imagesFromFuel).map(this.renderThumbnailImage)}*/}
                </div>
                <h2>Vehicle Information</h2>
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
