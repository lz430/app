import React from 'react';
import PropTypes from 'prop-types';

export default class Group extends React.PureComponent {
    static propTypes = {
        showIf: PropTypes.bool.isRequired,
        children: PropTypes.node.isRequired,
    };
    static defaultProps = {
        showIf: true,
    };

    render() {
        if (!this.props.showIf) {
            return <div />;
        }

        return <div style={{ margin: '1em 0' }}>{this.props.children}</div>;
    }
}
