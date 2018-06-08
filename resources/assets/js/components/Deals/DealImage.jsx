import React from 'react';

class DealImage extends React.PureComponent {
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
            <img
                className={this.props.featureImageClass}
                src={this.featuredImageUrl()}
            />
        );
    }
}

export default DealImage;
