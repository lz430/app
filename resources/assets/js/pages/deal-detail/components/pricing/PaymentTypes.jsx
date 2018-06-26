import React from 'react';
import PropTypes from 'prop-types';

class PaymentTypes extends React.PureComponent {
    static propTypes = {
        onChange: PropTypes.func.isRequired,
        purchaseStrategy: PropTypes.string.isRequired,
    };

    static defaultProps = {
        onChange: tabName => {},
    };

    handleTabChange(tabName) {
        this.props.onChange(tabName);
    }

    render() {
        return (
            <div className="deal-price">
                <div className="tabs">
                    <div
                        onClick={() => {
                            this.handleTabChange('cash');
                        }}
                        className={`tabs__tab ${
                            this.props.purchaseStrategy === 'cash'
                                ? 'tabs__tab--selected'
                                : ''
                        }`}
                    >
                        Cash
                    </div>
                    <div
                        onClick={() => {
                            this.handleTabChange('finance');
                        }}
                        className={`tabs__tab ${
                            this.props.purchaseStrategy === 'finance'
                                ? 'tabs__tab--selected'
                                : ''
                        }`}
                    >
                        Finance
                    </div>
                    <div
                        onClick={() => {
                            this.handleTabChange('lease');
                        }}
                        className={`tabs__tab ${
                            this.props.purchaseStrategy === 'lease'
                                ? 'tabs__tab--selected'
                                : ''
                        }`}
                    >
                        Lease
                    </div>
                </div>
            </div>
        );
    }
}

export default PaymentTypes;
