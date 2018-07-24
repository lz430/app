import React from 'react';
import PropTypes from 'prop-types';
import { dealType } from 'types';

export default class DealStockNumber extends React.PureComponent {
    static propTypes = {
        deal: dealType.isRequired,
    };

    render() {
        return <span>Stock # DMR-{this.props.deal.id}</span>;
    }
}
