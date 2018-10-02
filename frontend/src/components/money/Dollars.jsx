import React from 'react';
import PropTypes from 'prop-types';
import { moneyValueType } from '../../types';
import { fromUnknownInput } from '../../src/money';

export default class Dollars extends React.Component {
    static propTypes = {
        value: moneyValueType.isRequired,
        multiplier: PropTypes.number,
    };

    static defaultProps = {
        multiplier: 1,
    };

    static format = '$0,0';

    render() {
        try {
            const dinero = fromUnknownInput(
                this.props.value,
                this.props.multiplier
            );

            return <span>{dinero.toFormat(Dollars.format)}</span>;
        } catch (err) {
            return <span>N/A</span>;
        }
    }
}
