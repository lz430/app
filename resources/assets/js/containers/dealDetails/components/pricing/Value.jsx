import React from 'react';

class Value extends React.PureComponent {
    render() {
        if (! this.props.showIf) {
            return <div />
        }

        const style = {float: 'right'};

        if (this.props.isNegative) {
            style.color = 'red';
        }

        return (
            <div style={style}>{this.props.isNegative ? '-' : ''}{this.props.children}</div>
        )
    }
}

Value.defaultProps = {
    showIf: true,
    isNegative: false
};

export default Value;
