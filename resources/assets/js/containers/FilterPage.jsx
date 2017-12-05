import React from 'react';
import R from 'ramda';
import Modal from 'components/Modal';
import MakeSelector from 'components/MakeSelector';
import PropTypes from 'prop-types';
import Deals from 'components/Deals/Deals';
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
                buttonCloseDisabled={this.props.selectedMakes.length == 0}
            >
                <MakeSelector />
            </Modal>
        );
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

FilterPage.propTypes = {
    selectedMakes: PropTypes.arrayOf(PropTypes.string),
};

const mapStateToProps = state => {
    return {
        selectedMakes: state.selectedMakes,
        window: state.window,
        closeMakeSelectorModal: state.closeMakeSelectorModal,
        clearSelectedDeal: state.clearSelectedDeal,
        smallFiltersShown: state.smallFiltersShown,
        showMakeSelectorModal: state.showMakeSelectorModal,
        selectedDeal: state.selectedDeal,
    };
};

export default connect(mapStateToProps, Actions)(FilterPage);
