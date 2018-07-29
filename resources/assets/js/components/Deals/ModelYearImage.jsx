import React from 'react';
import LazyLoad from 'react-lazyload';
import classNames from 'classnames';

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
            <LazyLoad height={200} offset={100} overflow={true}>
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
