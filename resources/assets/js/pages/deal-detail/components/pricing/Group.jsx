import React from 'react';

export default class Group extends React.PureComponent {
    render() {
        return <div style={{ margin: '1em 0' }}>{this.props.children}</div>;
    }
}
