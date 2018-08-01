import React from 'react';
import PropTypes from 'prop-types';

import Line from './Line';
import Label from './Label';
import Value from './Value';

export default class TaxesAndFees extends React.PureComponent {
    static propTypes = {
        items: PropTypes.array,
    };

    render() {
        return (
            <div style={{ marginBottom: '.75em' }}>
                {this.props.items
                    .filter(item => item.rawValue > 0)
                    .map(item => (
                        <Line key={item.label}>
                            <Label>{item.label}</Label>
                            <Value>{item.value}</Value>
                        </Line>
                    ))}
            </div>
        );
    }
}
