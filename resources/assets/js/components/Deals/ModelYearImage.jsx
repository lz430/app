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
            <LazyLoad height={200} offset={100} overflow={true}>
                <div className="thumbnail-container">
                    <img
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
