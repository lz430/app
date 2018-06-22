import React from 'react';

class Label extends React.PureComponent {
    render() {
        const style = {display: 'inline-block', ...this.props.style};

        return (
            <div style={style}>{this.props.children}</div>
        )
    }
}

Label.defaultProps = {
    style: {}
};

export default Label;