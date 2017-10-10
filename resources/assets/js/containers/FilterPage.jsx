import React from 'react';
import R from 'ramda';
import Modal from 'components/Modal';
import MakeSelector from 'components/MakeSelector';
import Deals from 'components/Deals';
import Sortbar from 'components/Sortbar';
import Filterbar from 'components/Filterbar';
import CompareBar from 'components/CompareBar';
import FilterPanel from 'components/FilterPanel';
import { connect } from 'react-redux';
import * as Actions from 'actions/index';
import util from 'src/util';
import CashFinanceLeaseCalculator from '../components/CashFinanceLeaseCalculator';

class FilterPage extends React.PureComponent {
    renderMakeSelectionModal() {
        return (
            <Modal
                onClose={this.props.closeMakeSelectorModal}
                title="Select brand preference"
                subtitle="Select one or more brands to compare"
                closeText="Show available vehicles"
                buttonCloseDisabled={this.selectedAnyBrands}
            >
                <MakeSelector />
            </Modal>
        );
    }

    selectedAnyBrands() {
        // return whether MakeSelector.selectedMakes.length > 0
        return true;
    }

    renderDealRebatesModal() {
        return (
            <Modal
                onClose={this.props.clearSelectedDeal}
                closeText="Back to results"
            >
                <CashFinanceLeaseCalculator />
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
                <Sortbar />
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
            <div>
                {this.props.showMakeSelectorModal ? (
                    this.renderMakeSelectionModal()
                ) : (
                    ''
                )}

                {this.props.selectedDeal ? this.renderDealRebatesModal() : ''}

                {this.renderFilterPanelAndDeals()}
            </div>
        );
    }
}

export default connect(R.identity, Actions)(FilterPage);
