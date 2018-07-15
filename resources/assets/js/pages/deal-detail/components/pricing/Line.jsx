import React from 'react';

export default class Line extends React.PureComponent {
    static defaultProps = {
        isImportant: false,
        isSemiImportant: false,
        isSectionTotal: false,
        style: {},
    };

    render() {
        const style = { margin: '.25em 0', ...this.props.style };

        if (this.props.isSemiImportant) {
            style.fontWeight = 'bold';
        }

        if (this.props.isImportant) {
            style.fontWeight = 'bold';
            style.fontSize = '1.25em';
        }

        return (
            <div style={style}>
                {this.props.isSectionTotal && (
                    <div
                        style={{
                            float: 'right',
                            width: '5rem',
                            height: '1px',
                            backgroundColor: '#ccc',
                            margin: '.5em 0',
                        }}
                    />
                )}
                <div style={{ clear: 'both' }}>{this.props.children}</div>
            </div>
        );
    }
}
