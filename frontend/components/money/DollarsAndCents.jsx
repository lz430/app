import React from 'react';
import PropTypes from 'prop-types';
import { moneyValueType } from '../../core/types';
import { fromUnknownInput } from '../../apps/pricing/money';

export default class DollarsAndCents extends React.Component {
    static propTypes = {
        value: moneyValueType.isRequired,
        multiplier: PropTypes.number,
    };

    static defaultProps = {
        multiplier: 1,
    };

    static format = '$0,0.00';

    render() {
        try {
            const dinero = fromUnknownInput(
                this.props.value,
                this.props.multiplier
            );

            return <span>{dinero.toFormat(DollarsAndCents.format)}</span>;
        } catch (err) {
            console.log(err);
            return <span>N/A</span>;
        }
    }
}
