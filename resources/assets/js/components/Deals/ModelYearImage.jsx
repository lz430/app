import React from 'react';
import LazyLoad from 'react-lazyload';

class ModelYearImage extends React.PureComponent {
    state = {
        fallbackDealImage: '/images/deal-missing-thumbnail.jpg',
    };

    featuredImageUrl() {
        if (
            this.props.modelYear.thumbnail &&
            this.props.modelYear.thumbnail.url
        ) {
            return this.props.modelYear.thumbnail.url;
        }

        return false;
    }

    render() {
        const thumbnail = this.featuredImageUrl();

        return (
            <LazyLoad once={true} height={200} offset={400} overflow={true}>
                <div className="thumbnail-container thumbnail">
                    {thumbnail && (
                        <img
                            src={thumbnail}
                            onClick={() => {
                                this.props.selectModelYear();
                            }}
                        />
                    )}
                    {!thumbnail && (
                        <img
                            className="placeholder"
                            src={this.state.fallbackDealImage}
                            onClick={() => {
                                this.props.selectModelYear();
                            }}
                        />
                    )}
                </div>
            </LazyLoad>
        );
    }
}

export default ModelYearImage;
