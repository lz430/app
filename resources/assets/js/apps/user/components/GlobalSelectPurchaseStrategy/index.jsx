import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { setPurchaseStrategy } from '../../actions';
import { getUserPurchaseStrategy } from '../../selectors';

class GlobalSelectPurchaseStrategy extends React.Component {
    static propTypes = {
        purchaseStrategy: PropTypes.string.isRequired,
        onSetPurchaseStrategy: PropTypes.func.isRequired,
        afterSetPurchaseStrategy: PropTypes.func,
    };

    /**
     * @param strategy
     */
    handlePurchaseStrategyChange(strategy) {
        if (strategy === this.props.purchaseStrategy) {
            return;
        }

        this.props.onSetPurchaseStrategy(strategy);

        if (typeof this.props.afterSetPurchaseStrategy === 'function') {
            this.props.afterSetPurchaseStrategy(strategy);
        }
    }

    render() {
        return (
            <div className="button-group">
                <div
                    onClick={() => {
                        this.handlePurchaseStrategyChange('cash');
                    }}
                    className={`button-group__button ${
                        this.props.purchaseStrategy === 'cash'
                            ? 'button-group__button--selected'
                            : ''
                    }`}
                >
                    Cash
                </div>
                <div
                    onClick={() => {
                        this.handlePurchaseStrategyChange('finance');
                    }}
                    className={`button-group__button ${
                        this.props.purchaseStrategy === 'finance'
                            ? 'button-group__button--selected'
                            : ''
                    }`}
                >
                    Finance
                </div>
                <div
                    onClick={() => {
                        this.handlePurchaseStrategyChange('lease');
                    }}
                    className={`button-group__button ${
                        this.props.purchaseStrategy === 'lease'
                            ? 'button-group__button--selected'
                            : ''
                    }`}
                >
                    Lease
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        purchaseStrategy: getUserPurchaseStrategy(state),
    };
};

const mapDispatchToProps = dispatch => {
    return {
        onSetPurchaseStrategy: strategy => {
            return dispatch(setPurchaseStrategy(strategy));
        },
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(GlobalSelectPurchaseStrategy);
