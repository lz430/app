import React from 'react';
import PropTypes from 'prop-types';

export default class Group extends React.PureComponent {
    static propTypes = {
        style: PropTypes.object,
        showIf: PropTypes.bool.isRequired,
        children: PropTypes.any,
    };
    static defaultProps = {
        style: { margin: '1em 0' },
        showIf: true,
    };

    render() {
        if (!this.props.showIf) {
            return false;
        }

        return <div style={this.props.style}>{this.props.children}</div>;
    }
}
