import React from 'react';

class ModelYearImage extends React.PureComponent {
    constructor(props) {
        super(props);

        this.state = {
            fallbackDealImage: '/images/dmr-placeholder.jpg',
            externalImages: null,
        };
    }

    featuredImageUrl() {
        if (this.props.modelYear.thumbnail && this.props.modelYear.thumbnail.url) {
            return this.props.modelYear.thumbnail.url;
        }

        return this.state.fallbackDealImage;
    }

    render() {
        return (
            <img
                className='modelyear__image'
                src={this.featuredImageUrl()}
            />
        );
    }
}

export default ModelYearImage;
