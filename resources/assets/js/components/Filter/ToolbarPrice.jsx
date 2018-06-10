import React from 'react';
import PropTypes from 'prop-types';

import Sortbar from 'components/Filter/Sortbar';
import { connect } from 'react-redux';
import * as Actions from 'actions/index';

/**
 *
 */
class ToolbarPrice extends React.Component {
    handleTabChange(tabName) {
        this.props.selectTab(tabName);
        this.props.getBestOffersForLoadedDeals();
    }

    renderAccuPricingCta() {
        return (
            <div>
                <div className="accupricing-cta accupricing-cta--horizontal">
                    <a onClick={this.props.showAccuPricingModal}>
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

    renderSelectedTabButtons() {
        return (
            <div className="button-group">
                <div
                    onClick={() => {
                        this.handleTabChange('cash');
                    }}
                    className={`button-group__button ${
                        this.props.selectedTab === 'cash'
                            ? 'button-group__button--selected'
                            : ''
                    }`}
                >
                    Cash
                </div>
                <div
                    onClick={() => {
                        this.handleTabChange('finance');
                    }}
                    className={`button-group__button ${
                        this.props.selectedTab === 'finance'
                            ? 'button-group__button--selected'
                            : ''
                    }`}
                >
                    Finance
                </div>
                <div
                    onClick={() => {
                        this.handleTabChange('lease');
                    }}
                    className={`button-group__button ${
                        this.props.selectedTab === 'lease'
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
                        {this.renderSelectedTabButtons()}
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
        window: state.window,
        selectedTab: state.selectedTab,
        searchQuery: state.searchQuery,
    };
};

export default connect(
    mapStateToProps,
    Actions
)(ToolbarPrice);
