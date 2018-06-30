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
        const total = util.moneyFormat(
            this.props.items.reduce((total, item) => total + item.rawValue, 0)
        );

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
                    <Value>{total}</Value>
                </Line>
                {this.state.opened && (
                    <div style={{ marginBottom: '.75em' }}>
                        {this.props.items.map(item => (
                            <Line
                                key={item.label}
                                style={{ margin: '.125em .5em .125em .5em' }}
                            >
                                <Label style={{ fontSize: '.9em' }}>
                                    {item.label}
                                </Label>
                                <Value style={{ fontSize: '.9em' }}>
                                    {item.value}
                                </Value>
                            </Line>
                        ))}
                    </div>
                )}
            </div>
        );
    }

    handleToggle = () => {
        this.setState({ opened: !this.state.opened });
    };
}
