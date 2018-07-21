import React from 'react';
import PropTypes from 'prop-types';

export default class DealStockNumber extends React.PureComponent {
    static propTypes = {
        deal: PropTypes.object.isRequired,
    };

    render() {
        return <span>Stock # DMR-{this.props.deal.id}</span>;
    }
}
