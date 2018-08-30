import React from 'react';
import PropTypes from 'prop-types';
import { modelYearType } from 'types';

import LazyLoad from 'react-lazyload';

class ModelYearImage extends React.PureComponent {
    static propTypes = {
        modelYear: modelYearType,
        selectModelYear: PropTypes.func.isRequired,
    };

    state = {
        fallbackDealImage: '/images/deal-missing-thumbnail.jpg',
    };

    featuredImageUrl() {
        if (this.props.modelYear.thumbnail) {
            return this.props.modelYear.thumbnail;
        }

        return false;
    }

    render() {
        const thumbnail = this.featuredImageUrl();

        return (
            <LazyLoad once={true} height={200} offset={400}>
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
