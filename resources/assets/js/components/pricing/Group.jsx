import React from 'react';

export default class Group extends React.PureComponent {
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
