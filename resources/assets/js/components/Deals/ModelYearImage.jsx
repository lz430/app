import React from 'react';
import LazyLoad from 'react-lazyload';

class ModelYearImage extends React.PureComponent {
    constructor(props) {
        super(props);

        this.state = {
            fallbackDealImage: '/images/dmr-placeholder.jpg',
            externalImages: null,
        };
    }

    featuredImageUrl() {
        if (
            this.props.modelYear.thumbnail &&
            this.props.modelYear.thumbnail.url
        ) {
            return this.props.modelYear.thumbnail.url;
        }

        return this.state.fallbackDealImage;
    }

    render() {
        return (
            <LazyLoad height={200} overflow={true} offset={400}>
                <div className="modelyear__image-container">
                    <img
                        className="modelyear__image"
                        src={this.featuredImageUrl()}
                        onClick={() => {
                            this.props.selectModelYear();
                        }}
                    />
                </div>
            </LazyLoad>
        );
    }
}

export default ModelYearImage;
