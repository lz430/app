import React from 'react';
import PropTypes from 'prop-types';
import LazyLoad from 'react-lazyload';
import { dealType } from 'types';
import classNames from 'classnames';

export default class DealImage extends React.PureComponent {
    static propTypes = {
        deal: dealType.isRequired,
        size: PropTypes.string.isRequired,
        lazy: PropTypes.bool.isRequired,
        link: PropTypes.bool.isRequired,
        featureImageClass: PropTypes.string,
    };

    static defaultProps = {
        size: 'thumbnail',
        link: true,
        lazy: true,
    };

    state = {
        fallbackDealImage: '/images/deal-missing-thumbnail.jpg',
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

        return false;
    }

    renderImage() {
        const imageProps = {};
        if (this.props.featureImageClass) {
            imageProps.className = this.props.featureImageClass;
        }

        const thumbnail = this.featuredImageUrl();
        return (
            <div className={classNames('thumbnail-container', this.props.size)}>
                {this.props.link && (
                    <a href={`/deals/${this.props.deal.id}`}>
                        {thumbnail && <img {...imageProps} src={thumbnail} />}
                        {!thumbnail && (
                            <img
                                className="placeholder"
                                src={this.state.fallbackDealImage}
                            />
                        )}
                    </a>
                )}
                {!this.props.link && (
                    <img {...imageProps} src={this.featuredImageUrl()} />
                )}
            </div>
        );
    }

    render() {
        if (this.props.lazy) {
            return (
                <LazyLoad height={200} offset={100}>
                    {this.renderImage()}
                </LazyLoad>
            );
        } else {
            return this.renderImage();
        }
    }
}
