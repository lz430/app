import React from 'react';
import PropTypes from 'prop-types';

import Loading from '../../../components/Loading';

export default class Value extends React.PureComponent {
    static propTypes = {
        showIf: PropTypes.bool.isRequired,
        isLoading: PropTypes.bool.isRequired,
        isNegative: PropTypes.bool.isRequired,
        children: PropTypes.node.isRequired,
        style: PropTypes.object,
    };

    static defaultProps = {
        style: { float: 'right' },

        showIf: true,
        isNegative: false,
        isLoading: false,
    };

    render() {
        if (!this.props.showIf) {
            return false;
        }

        const style = { ...this.props.style };

        if (this.props.isNegative) {
            style.color = '#41b1ac';
        }

        return (
            <div style={style}>
                {this.props.isLoading && (
                    <div data-loading-size="regular">
                        <Loading style={{ height: '.5em' }} />
                    </div>
                )}
                {this.props.isLoading || (
                    <div>
                        {this.props.isNegative ? '-' : ''}
                        {this.props.children}
                    </div>
                )}
            </div>
        );
    }
}
