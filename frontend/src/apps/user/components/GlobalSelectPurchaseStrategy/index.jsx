import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import classNames from 'classnames';
import { setPurchaseStrategy } from '../../actions';
import { getUserPurchaseStrategy } from '../../selectors';

class GlobalSelectPurchaseStrategy extends React.Component {
    static propTypes = {
        purchaseStrategy: PropTypes.string.isRequired,
        showExplanation: PropTypes.bool.isRequired,
        onSetPurchaseStrategy: PropTypes.func.isRequired,
        afterSetPurchaseStrategy: PropTypes.func,
    };

    static defaultProps = {
        showExplanation: true,
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

    renderExplanation() {
        if (this.props.purchaseStrategy === 'cash') {
            return (
                <span>Based on cost of vehicle excluding taxes and fees.</span>
            );
        }

        if (this.props.purchaseStrategy === 'finance') {
            return (
                <span>Based on 5% interest, 10% down and 60 month loan.</span>
            );
        }

        if (this.props.purchaseStrategy === 'lease') {
            return <span>Based on 10,000 miles and 36 months.</span>;
        }
    }

    renderButtons() {
        return (
            <div className="button-group">
                <div
                    onClick={() => {
                        this.handlePurchaseStrategyChange('cash');
                    }}
                    className={classNames('button-group__button', {
                        'button-group__button--selected':
                            this.props.purchaseStrategy === 'cash',
                    })}
                >
                    Cash
                </div>
                <div
                    onClick={() => {
                        this.handlePurchaseStrategyChange('finance');
                    }}
                    className={classNames('button-group__button', {
                        'button-group__button--selected':
                            this.props.purchaseStrategy === 'finance',
                    })}
                >
                    Finance
                </div>
                <div
                    onClick={() => {
                        this.handlePurchaseStrategyChange('lease');
                    }}
                    className={classNames('button-group__button', {
                        'button-group__button--selected':
                            this.props.purchaseStrategy === 'lease',
                    })}
                >
                    Lease
                </div>
            </div>
        );
    }

    render() {
        return (
            <div className="purchase-strategy-container">
                {this.renderButtons()}
                {this.props.showExplanation && (
                    <div className="purchase-strategy-explanation">
                        {this.renderExplanation()}
                    </div>
                )}
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
