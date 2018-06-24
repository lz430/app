import React from 'react';
import Sortbar from './Sortbar';
import { connect } from 'react-redux';
import { showAccuPricingModal } from 'apps/common/actions';
import { requestSearch } from 'pages/deal-list/actions';

import { setPurchaseStrategy } from 'apps/user/actions';

/**
 *
 */
class ToolbarPrice extends React.Component {
    /**
     * @param strategy
     */
    handlePurchaseStrategyChange(strategy) {
        this.props.onSetPurchaseStrategy(strategy);
        this.props.onRequestSearch();
    }

    renderAccuPricingCta() {
        return (
            <div>
                <div className="accupricing-cta accupricing-cta--horizontal">
                    <a onClick={this.props.onShowAccuPricingModal}>
                        <img
                            src="/images/accupricing-logo.png"
                            className="accupricing-cta__logo"
                        />
                    </a>
                    <p className="accupricing-cta__disclaimer">
                        * Includes taxes, dealer fees and rebates.
                    </p>
                </div>
            </div>
        );
    }

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
                <div className="filter-page__top-row__section filter-page__top-row__section--accuPricing">
                    {this.renderAccuPricingCta()}
                </div>
                {this.props.searchQuery.entity === 'deal' && (
                    <div className="filter-page__top-row__section filter-page__top-row__section--tabButtons">
                        {this.renderPurchaseStrategyButtons()}
                    </div>
                )}
                <div className="filter-page__top-row__section filter-page__top-row__section--sortbar">
                    <Sortbar />
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        window: state.common.window,
        purchaseStrategy: state.user.purchasePreferences.strategy,
        searchQuery: state.pages.dealList.searchQuery,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        onShowAccuPricingModal: () => {
            return dispatch(showAccuPricingModal);
        },

        onSetPurchaseStrategy: strategy => {
            return dispatch(setPurchaseStrategy(strategy));
        },

        onRequestSearch: () => {
            return dispatch(requestSearch());
        },
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ToolbarPrice);
