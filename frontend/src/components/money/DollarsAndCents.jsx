import React from 'react';
import PropTypes from 'prop-types';
import { moneyValueType } from '../../types';
import { fromUnknownInput } from '../../src/money';

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
