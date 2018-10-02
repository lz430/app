import React from 'react';
import { dealType } from 'types';

export default class DealStockNumber extends React.PureComponent {
    static propTypes = {
        deal: dealType.isRequired,
    };

    render() {
        return <span>Stock # DMR-{this.props.deal.id}</span>;
    }
}
