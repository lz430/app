import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

class PaymentWidget extends React.PureComponent {
    static propTypes = {
        purchaseStrategy: PropTypes.string.isRequired,
        onSetPurchaseStrategy: PropTypes.func.isRequired,
        onRequestSearch: PropTypes.func.isRequired,
    };

    data = [
        {
            key: 'cash',
            label: 'Cash',
            explanation: 'Based on cost of vehicle excluding taxes and fees.',
        },
        {
            key: 'finance',
            label: 'Finance',
            explanation: 'Based on 5% interest, 10% down and 60 month loan.',
        },
        {
            key: 'lease',
            label: 'Lease',
            explanation:
                'Based on 10,000 miles, 36 months and an additional $1,500 down',
        },
    ];

    onChange(strategy) {
        if (strategy === this.props.purchaseStrategy) {
            return;
        }

        this.props.onSetPurchaseStrategy(strategy);
        this.props.onRequestSearch();
    }

    renderButton(item) {
        return (
            <div
                key={item.key}
                onClick={() => this.onChange(item.key)}
                className={classNames('tray-select-button', {
                    active: this.props.purchaseStrategy === item.key,
                })}
            >
                <div className="label">{item.label}</div>
                {this.props.purchaseStrategy === item.key && (
                    <div className="explanation">{item.explanation}</div>
                )}
            </div>
        );
    }

    render() {
        return (
            <div className="tray-select">
                {this.data.map(item => {
                    return this.renderButton(item);
                })}
            </div>
        );
    }
}

export default PaymentWidget;
