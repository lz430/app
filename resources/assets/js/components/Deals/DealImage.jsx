import React from 'react';
import PropTypes from 'prop-types';
import LazyLoad from 'react-lazyload';

class DealImage extends React.PureComponent {
    static propTypes = {
        deal: PropTypes.object.isRequired,
        featureImageClass: PropTypes.string.isRequired,
    };

    constructor(props) {
        super(props);

        this.state = {
            fallbackDealImage: '/images/dmr-placeholder.jpg',
        };
    }

    featuredImageUrl() {
        if (this.props.deal.thumbnail && this.props.deal.thumbnail.url) {
            return this.props.deal.thumbnail.url;
        }

        if (this.props.deal.photos[0]) {
            return this.props.deal.photos[0].url;
        }
        return this.state.fallbackDealImage;
    }

    render() {
        return (
            <LazyLoad height={200} overflow={true}>
                <img
                    className={this.props.featureImageClass}
                    src={this.featuredImageUrl()}
                />
            </LazyLoad>
        );
    }
}

export default DealImage;
