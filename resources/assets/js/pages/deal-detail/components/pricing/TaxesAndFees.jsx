import React from 'react';
import Line from './Line';
import Label from './Label';
import Value from './Value';
import util from '../../../../src/util';
import Group from './Group';
import Header from './Header';

export default class TaxesAndFees extends React.PureComponent {
    render() {
        return (
            <div style={{ marginBottom: '.75em' }}>
                {this.props.items.map(item => (
                    <Line key={item.label}>
                        <Label>{item.label}</Label>
                        <Value>{item.value}</Value>
                    </Line>
                ))}
            </div>
        );
    }
}
