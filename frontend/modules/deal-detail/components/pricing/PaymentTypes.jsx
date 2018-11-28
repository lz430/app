import React from 'react';
import PropTypes from 'prop-types';
import { Row, Col } from 'reactstrap';
import classNames from 'classnames';

class PaymentTypes extends React.PureComponent {
    static propTypes = {
        onChange: PropTypes.func.isRequired,
        purchaseStrategy: PropTypes.string.isRequired,
    };

    strategies = [
        {
            label: 'Cash',
            strategy: 'cash',
        },
        {
            label: 'Finance',
            strategy: 'finance',
        },
        {
            label: 'Lease',
            strategy: 'lease',
        },
    ];

    handleTabChange(purchaseStrategy) {
        if (purchaseStrategy === this.props.purchaseStrategy) {
            return;
        }
        this.props.onChange(purchaseStrategy);
    }

    render() {
        return (
            <div>
                <Row noGutters>
                    {this.strategies.map(role => {
                        const checked =
                            this.props.purchaseStrategy === role.strategy;
                        return (
                            <Col
                                key={role.strategy}
                                onClick={() =>
                                    this.handleTabChange(role.strategy)
                                }
                                className={classNames(
                                    'cart__discount_role',
                                    'text-center',
                                    'bg-light',
                                    'p-2',
                                    'border',
                                    { 'border-primary': checked },
                                    { 'border-default': !checked }
                                )}
                            >
                                {role.label}
                            </Col>
                        );
                    })}
                </Row>
                <hr />
            </div>
        );
    }
}

export default PaymentTypes;
