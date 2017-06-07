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

    selectFeaturedImage(index) {
        this.setState({
            featuredImage: this.props.deal.photos.data[index],
        });
    }

    renderThumbnailImage(photo, index) {
        const imageClass =
            'deal-details__thumbnail-image ' +
            (this.state.featuredImage.id === photo.id
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
        const photos = this.props.deal.photos.data;
        return (
            <div className="deal-details">
                {this.renderFeaturedImage()}

                <hr />

                <div className="deal-details__thumbnail-images">
                    {photos.map(this.renderThumbnailImage)}
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        deal: state.selectedDeal,
        fallbackDealImage: state.fallbackDealImage,
    };
};

export default connect(mapStateToProps, Actions)(DealDetails);
