import React from 'react';
import { connect } from 'react-redux';
import { setPurchaseStrategy } from 'apps/user/actions';

/**
 *
 */
class PriceBar extends React.Component {
    renderPurchaseStrategyButtons() {
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

    render() {
        return (
            <div className="filter-page__top-row">
                <div className="filter-page__top-row__section filter-page__top-row__section--tabButtons" />
            </div>
        );
    }

    /**
     * @param strategy
     */
    handlePurchaseStrategyChange(strategy) {
        this.props.onSetPurchaseStrategy(strategy);
    }
}

const mapStateToProps = state => {
    return {
        window: state.common.window,
        closeMakeSelectorModal: state.common.closeMakeSelectorModal,
        purchaseStrategy: state.user.purchasePreferences.strategy,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        onSetPurchaseStrategy: data => {
            return dispatch(setPurchaseStrategy(data));
        },
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(PriceBar);
