import React from 'react';
import PropTypes from 'prop-types';

export default class ColorSwatchIcon extends React.PureComponent {
    static propTypes = {
        color: PropTypes.string.isRequired,
    };

    render() {
        return (
            <div
                style={{
                    backgroundColor: this.props.color,
                    display: 'inline-block',
                }}
            />
        );
    }
}
