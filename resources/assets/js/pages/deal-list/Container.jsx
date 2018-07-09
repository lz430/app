import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { StickyContainer } from 'react-sticky';

import util from 'src/util';

import Modal from 'components/Modal';
import CompareBar from 'components/CompareBar';

import Deals from './components/Deals';
import MakeSelector from './components/MakeSelector';
import ToolbarSelectedFilters from './components/ToolbarSelectedFilters';
import ToolbarPrice from './components/ToolbarPrice';
import FilterPanel from './components/FilterPanel';

import { closeMakeSelectorModal } from 'apps/common/actions';

import { initDealListData } from './actions';
import { getSelectedFiltersByCategory } from './selectors';

class Container extends React.PureComponent {
    static propTypes = {
        searchQuery: PropTypes.object.isRequired,
        onInit: PropTypes.func.isRequired,
        onCloseMakeSelectorModal: PropTypes.func.isRequired,
        makeSelectorModalIsOpen: PropTypes.bool.isRequired,
        smallFiltersShown: PropTypes.bool,
        selectedFiltersByCategory: PropTypes.object,
    };

    componentDidMount() {
        this.props.onInit();
    }

    renderMakeSelectionModal() {
        return (
            <Modal
                onClose={this.props.onCloseMakeSelectorModal}
                title="Select brand preference"
                subtitle="Select one or more brands to compare"
                closeText="Show available vehicles"
                buttonCloseDisabled={
                    !this.props.selectedFiltersByCategory['make'] ||
                    this.props.selectedFiltersByCategory['make'].length === 0
                }
            >
                <MakeSelector />
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
                {this.props.makeSelectorModalIsOpen
                    ? this.renderMakeSelectionModal()
                    : ''}

                {this.renderFilterPanelAndDeals()}
            </StickyContainer>
        );
    }
}

const mapStateToProps = state => {
    return {
        window: state.common.window,
        smallFiltersShown: state.common.smallFiltersShown,
        makeSelectorModalIsOpen: state.common.showMakeSelectorModal,
        searchQuery: state.pages.dealList.searchQuery,
        selectedFiltersByCategory: getSelectedFiltersByCategory(state),
    };
};

const mapDispatchToProps = dispatch => {
    return {
        onInit: () => {
            return dispatch(initDealListData());
        },
        onCloseMakeSelectorModal: () => {
            return dispatch(closeMakeSelectorModal());
        },
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Container);
