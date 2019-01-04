import React from 'react';

import ImageGallery from 'react-image-gallery';
import { dealType } from '../../../core/types';
import { StickyContainer } from 'react-sticky';

export default class extends React.PureComponent {
    static propTypes = {
        deal: dealType,
    };

    allImages() {
        return this.props.deal.photos;
    }

    galleryImages() {
        return this.allImages().map(image => {
            return { original: image.url };
        });
    }

    render() {
        return (
            <StickyContainer>
                <div className="deal-details__images">
                    <ImageGallery
                        items={this.galleryImages()}
                        showBullets={true}
                        showIndex={true}
                        showThumbnails={false}
                        showPlayButton={false}
                        showFullscreenButton={false}
                    />
                </div>
            </StickyContainer>
        );
    }
}
