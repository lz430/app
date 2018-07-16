import React from 'react';
import PropTypes from 'prop-types';
import LazyLoad from 'react-lazyload';

export default class DealImage extends React.PureComponent {
    static propTypes = {
        deal: PropTypes.object.isRequired,
        size: PropTypes.string,
        featureImageClass: PropTypes.string,
    };

    static defaultProps = {
        size: 'thumbnail',
    };

    state = {
        fallbackDealImage: '/images/dmr-placeholder.jpg',
    };

    featuredImageUrl() {
        if (
            this.props.size === 'thumbnail' &&
            this.props.deal.thumbnail &&
            this.props.deal.thumbnail.url
        ) {
            return this.props.deal.thumbnail.url;
        }

        if (this.props.deal.photos[0]) {
            return this.props.deal.photos[0].url;
        }
        return this.state.fallbackDealImage;
    }

    render() {
        const imageProps = {};
        if (this.props.featureImageClass) {
            imageProps.className = this.props.featureImageClass;
        }

        return (
            <LazyLoad height={200} overflow={true}>
                <div className="deal__image-container">
                    <a href={`/deals/${this.props.deal.id}`}>
                        <img {...imageProps} src={this.featuredImageUrl()} />
                    </a>
                </div>
            </LazyLoad>
        );
    }
}
