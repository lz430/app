import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { StickyContainer } from 'react-sticky';

import util from 'src/util';

import Modal from 'components/Modal';
import CashFinanceLeaseCalculator from 'components/CashFinanceLeaseCalculator';
import AccuPricingModal from 'components/AccuPricingModal';
import CompareBar from 'components/CompareBar';

import Deals from './components/Deals';
import MakeSelector from './components/MakeSelector';
import ToolbarSelectedFilters from './components/ToolbarSelectedFilters';
import ToolbarPrice from './components/ToolbarPrice';
import FilterPanel from './components/FilterPanel';

import { initDealListData } from './actions';

class Container extends React.PureComponent {
    static propTypes = {
        searchQuery: PropTypes.object.isRequired,
        onInit: PropTypes.func.isRequired,
    };

    componentDidMount() {
        this.props.onInit();
    }

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
        window: state.common.window,
        closeMakeSelectorModal: state.common.closeMakeSelectorModal,
        clearSelectedDeal: state.common.clearSelectedDeal,
        smallFiltersShown: state.common.smallFiltersShown,
        showMakeSelectorModal: false,
        selectedDeal: state.common.selectedDeal,
        searchQuery: state.pages.dealList.searchQuery,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        onInit: () => {
            return dispatch(initDealListData());
        },
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Container);
