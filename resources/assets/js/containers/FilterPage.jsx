import React from 'react';
import { connect } from 'react-redux';

import Modal from 'components/Modal';
import MakeSelector from 'components/MakeSelector';
import PropTypes from 'prop-types';
import Deals from 'components/Deals/Deals';
import Sortbar from 'components/Sortbar';
import Filterbar from 'components/Filter/Filterbar';
import CompareBar from 'components/CompareBar';
import FilterPanel from 'components/Filter/FilterPanel';
import * as Actions from 'actions/index';
import util from 'src/util';
import CashFinanceLeaseCalculator from 'components/CashFinanceLeaseCalculator';
import AccuPricingModal from 'components/AccuPricingModal';
import { StickyContainer, Sticky } from 'react-sticky';

class FilterPage extends React.PureComponent {
    static propTypes = {
        searchQuery: PropTypes.object.isRequired,
    };

    renderMakeSelectionModal() {
        return (
            <Modal
                onClose={this.props.closeMakeSelectorModal}
                title="Select brand preference"
                subtitle="Select one or more brands to compare"
                closeText="Show available vehicles"
                buttonCloseDisabled={this.props.searchQuery.makes.length == 0}
            >
                <MakeSelector />
            </Modal>
        );
    }

    renderCalculatorModal() {
        return (
            <Modal
                onClose={this.props.clearSelectedDeal}
                closeText="Back to results"
                deal={this.props.selectedDeal}
            >
                <CashFinanceLeaseCalculator deal={this.props.selectedDeal} />
            </Modal>
        );
    }

    renderFilterPanel() {
        const className =
            'filter-page__filter-panel ' +
            (util.windowIsLargerThanSmall(this.props.window.width)
                ? ''
                : 'filter-page__filter-panel--small ' +
                  (this.props.smallFiltersShown
                      ? 'filter-page__filter-panel--small-filters-shown'
                      : 'filter-page__filter-panel--small-filters-hidden'));

        return (
            <div className={className}>
                <FilterPanel />
            </div>
        );
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

    renderDeals() {
        const className =
            'filter-page__deals ' +
            (util.windowIsLargerThanSmall(this.props.window.width)
                ? ''
                : 'filter-page__deals--small ' +
                  (this.props.smallFiltersShown
                      ? 'filter-page__deals--small-filters-shown'
                      : 'filter-page__deals--small-filters-hidden'));

        return (
            <div className={className}>
                <Sticky>
                    {({ style }) => (
                        <div className="filter-page__top-row" style={style}>
                            <div className="filter-page__top-row__section filter-page__top-row__section--accuPricing">
                                {this.renderAccuPricingCta()}
                            </div>
                            {this.props.filterPage == 'deals' && (
                                <div className="filter-page__top-row__section filter-page__top-row__section--tabButtons">
                                    {this.renderSelectedTabButtons()}
                                </div>
                            )}
                            <div className="filter-page__top-row__section filter-page__top-row__section--sortbar">
                                <Sortbar />
                            </div>
                        </div>
                    )}
                </Sticky>
                <Filterbar />
                <Deals />
                <CompareBar />
            </div>
        );
    }

    renderFilterPanelAndDeals() {
        return (
            <div className="filter-page">
                {this.renderFilterPanel()}
                {this.renderDeals()}
            </div>
        );
    }

    render() {
        return (
            <StickyContainer>
                {this.props.showMakeSelectorModal
                    ? this.renderMakeSelectionModal()
                    : ''}

                {this.props.selectedDeal ? this.renderCalculatorModal() : ''}

                {this.renderFilterPanelAndDeals()}
                <AccuPricingModal />
            </StickyContainer>
        );
    }

    handleTabChange(tabName) {
        this.props.selectTab(tabName);
        this.props.getBestOffersForLoadedDeals();
    }
}

const mapStateToProps = state => {
    return {
        window: state.window,
        closeMakeSelectorModal: state.closeMakeSelectorModal,
        clearSelectedDeal: state.clearSelectedDeal,
        smallFiltersShown: state.smallFiltersShown,
        showMakeSelectorModal: state.showMakeSelectorModal,
        selectedDeal: state.selectedDeal,
        selectedTab: state.selectedTab,
        filterPage: state.filterPage,
        searchQuery: state.searchQuery,
    };
};

export default connect(
    mapStateToProps,
    Actions
)(FilterPage);
