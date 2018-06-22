import React from 'react';

class Line extends React.PureComponent {
    render() {
        const style = {margin: '.5em 0', ...this.props.style};

        if (this.props.isSemiImportant) {
            style.fontWeight = 'bold';
        }

        if (this.props.isImportant) {
            style.fontWeight = 'bold';
            style.fontSize = '1.25em';
        }

        return (
            <div style={style}>{this.props.children}</div>
        )
    }
}

Line.defaultProps = {
    isImportant: false,
    isSemiImportant: false,
    style: {}
};

export default Line;