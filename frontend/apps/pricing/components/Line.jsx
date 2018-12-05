import React from 'react';
import PropTypes from 'prop-types';

export default class Line extends React.PureComponent {
    static propTypes = {
        isSemiImportant: PropTypes.bool.isRequired,
        isImportant: PropTypes.bool.isRequired,
        isSectionTotal: PropTypes.bool.isRequired,
        style: PropTypes.object,
        children: PropTypes.node.isRequired,
    };

    static defaultProps = {
        isImportant: false,
        isSemiImportant: false,
        isSectionTotal: false,
        style: {},
    };

    render() {
        const style = { margin: '0', ...this.props.style };

        if (this.props.isSemiImportant) {
            style.fontWeight = 'bold';
        }

        if (this.props.isImportant) {
            style.borderTop = '1px solid #ccc';
            style.borderBottom = '1px solid #ccc';
            style.fontSize = '1.1rem';
            style.fontWeight = 'bold';
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
