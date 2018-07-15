import React from 'react';

export default class Separator extends React.PureComponent {
    static defaultProps = {
        showIf: true,
    };

    render() {
        if (!this.props.showIf) {
            return <div />;
        }

        return <hr />;
    }
}
