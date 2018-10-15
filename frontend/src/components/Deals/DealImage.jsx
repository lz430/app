import React from 'react';
import PropTypes from 'prop-types';
import LazyLoad from 'react-lazyload';
import { dealType } from '../../types';
import classNames from 'classnames';
import Link from 'next/link';

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
        fallbackDealImage: '/static/images/deal-missing-thumbnail.jpg',
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

    /**
     * Remove once everything supports react router
     */
    renderLinkedImage() {
        const imageProps = {};
        if (this.props.featureImageClass) {
            imageProps.className = this.props.featureImageClass;
        }

        const thumbnail = this.featuredImageUrl();

        if (thumbnail) {
            return (
                <Link
                    href={`/deals?id=${this.props.deal.id}`}
                    as={`/deals/${this.props.deal.id}`}
                >
                    <img alt="" {...imageProps} src={thumbnail} />
                </Link>
            );
        }

        return (
            <Link
                href={`/deals?id=${this.props.deal.id}`}
                as={`/deals/${this.props.deal.id}`}
            >
                <img
                    alt=""
                    className="placeholder"
                    src={this.state.fallbackDealImage}
                />
            </Link>
        );
    }

    renderImage() {
        const imageProps = {};
        if (this.props.featureImageClass) {
            imageProps.className = this.props.featureImageClass;
        }

        return (
            <div className={classNames('thumbnail-container', this.props.size)}>
                {this.props.link && this.renderLinkedImage()}
                {!this.props.link && (
                    <img {...imageProps} alt="" src={this.featuredImageUrl()} />
                )}
            </div>
        );
    }

    render() {
        if (this.props.lazy) {
            return (
                <LazyLoad once={true} height={200} offset={400}>
                    {this.renderImage()}
                </LazyLoad>
            );
        } else {
            return this.renderImage();
        }
    }
}
