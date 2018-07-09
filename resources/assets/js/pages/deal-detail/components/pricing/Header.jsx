import React from 'react';

export default class Header extends React.PureComponent {
    render() {
        const style = {
            margin: '.5em 0 0',
            fontWeight: 'bold',
            fontSize: '1.25em',
            textTransform: 'uppercase',
            ...this.props.style,
        };

        return <div style={style}>{this.props.children}</div>;
    }
}
