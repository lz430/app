import React from 'react';
import PropTypes from 'prop-types';

export default class Separator extends React.PureComponent {
    static propTypes = {
        showIf: PropTypes.bool.isRequired,
    };

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
