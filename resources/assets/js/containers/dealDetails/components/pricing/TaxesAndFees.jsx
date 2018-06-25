import React from 'react';
import Line from './Line';
import Label from './Label';
import Value from './Value';
import util from '../../../../src/util';

export default class TaxesAndFees extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = { opened: false };
    }

    render() {
        return (
            <div>
                <Line>
                    <Label>
                        <a
                            style={{ cursor: 'pointer' }}
                            onClick={this.handleToggle}
                        >
                            <span
                                style={{
                                    display: 'inline-block',
                                    width: '1em',
                                }}
                            >
                                {this.state.opened ? '\u25BF' : '\u25B9'}
                            </span>
                            Taxes &amp; Fees
                        </a>
                    </Label>
                </Line>
                {this.state.opened && (
                    <div>
                        {this.props.items.map(item => (
                            <Line
                                key={item.label}
                                style={{ margin: '.125em 0 .125em .25em' }}
                            >
                                <Label style={{ fontSize: '.9em' }}>
                                    {item.label}
                                </Label>
                                <Value style={{ fontSize: '.9em' }}>
                                    {item.value}
                                </Value>
                            </Line>
                        ))}
                        <Line style={{ margin: '.125em 0 .125em .25em' }}>
                            <Label style={{ fontSize: '.9em' }}>TOTAL</Label>
                            <Value style={{ fontSize: '.9em' }}>
                                {util.moneyFormat(
                                    this.props.items.reduce(
                                        (total, item) => total + item.rawValue,
                                        0
                                    )
                                )}
                            </Value>
                        </Line>
                    </div>
                )}
            </div>
        );
    }

    handleToggle = () => {
        this.setState({ opened: !this.state.opened });
    };
}
