import React from 'react';
import { connect } from 'react-redux';

import Modal from 'components/Modal';
import MakeSelector from 'components/MakeSelector';
import PropTypes from 'prop-types';
import Deals from 'components/Deals/Deals';
import ToolbarSelectedFilters from 'components/Filter/ToolbarSelectedFilters';
import ToolbarPrice from 'components/Filter/ToolbarPrice';
import CompareBar from 'components/Filter/CompareBar';
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
                buttonCloseDisabled={this.props.searchQuery.makes.length === 0}
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
                <ToolbarPrice />
                <ToolbarSelectedFilters />
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
        searchQuery: state.searchQuery,
    };
};

export default connect(
    mapStateToProps,
    Actions
)(FilterPage);
