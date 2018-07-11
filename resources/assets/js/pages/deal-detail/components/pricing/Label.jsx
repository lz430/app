import React from 'react';
import PropTypes from 'prop-types';

class Label extends React.PureComponent {
    static propTypes = {
        style: PropTypes.object,
        for: PropTypes.string,
        children: PropTypes.node,
    };

    defaultProps = {
        style: {},
        for: '',
    };

    render() {
        const style = { display: 'inline-block', ...this.props.style };

        return (
            <label htmlFor={this.props.for} style={style}>
                {this.props.children}
            </label>
        );
    }
}

export default Label;
