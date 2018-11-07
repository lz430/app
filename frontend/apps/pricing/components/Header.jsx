import React from 'react';
import PropTypes from 'prop-types';

export default class Header extends React.PureComponent {
    static propTypes = {
        style: PropTypes.object,
        children: PropTypes.node.isRequired,
    };

    render() {
        const style = {
            display: 'flex',
            alignItems: 'center',
            margin: '.5em 0 0',
            fontWeight: 'bold',
            fontSize: '1.25em',
            textTransform: 'uppercase',
            ...this.props.style,
        };

        return <div style={style}>{this.props.children}</div>;
    }
}
