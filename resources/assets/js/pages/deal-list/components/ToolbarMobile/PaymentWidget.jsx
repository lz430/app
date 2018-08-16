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
        },
        {
            key: 'finance',
            label: 'Finance',
        },
        {
            key: 'lease',
            label: 'Lease',
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
                {item.label}
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
