import React from 'react';

class DealImage extends React.PureComponent {
    render() {
        return (
            <img
                className={this.props.featureImageClass}
                src={this.props.featuredImageUrl}
            />
        );
    }
}

export default DealImage;
