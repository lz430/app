import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { StickyContainer } from 'react-sticky';
import miscicons from 'miscicons';
import SVGInline from 'react-svg-inline';
import util from 'src/util';

import Modal from 'components/Modal';

import { getUserLocation } from 'apps/user/selectors';
import { getIsPageLoading } from 'apps/page/selectors';

import Deals from './components/Deals';
import MakeSelector from './components/MakeSelector';
import ToolbarSelectedFilters from './components/ToolbarSelectedFilters';
import ToolbarPrice from './components/ToolbarPrice';
import FilterPanel from './components/FilterPanel';
import NoDealsOutOfRange from './components/NoDealsOutOfRange';

import { initDealListData, closeMakeSelectorModal } from './actions';
import { getSelectedFiltersByCategory } from './selectors';

class Container extends React.PureComponent {
    static propTypes = {
        searchQuery: PropTypes.object.isRequired,
        onInit: PropTypes.func.isRequired,
        onCloseMakeSelectorModal: PropTypes.func.isRequired,
        makeSelectorModalIsOpen: PropTypes.bool,
        smallFiltersShown: PropTypes.bool,
        selectedFiltersByCategory: PropTypes.object,
        userLocation: PropTypes.object.isRequired,
        isLoading: PropTypes.bool,
    };

    componentDidMount() {
        this.props.onInit();
    }

    renderPageLoadingIcon() {
        return <SVGInline svg={miscicons['loading']} />;
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
                {/* <CompareBar /> */}
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
        if (this.props.isLoading) {
            return this.renderPageLoadingIcon();
        }

        if (
            this.props.userLocation.latitude &&
            !this.props.userLocation.has_results
        ) {
            return <NoDealsOutOfRange />;
        }

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
        smallFiltersShown: state.pages.dealList.smallFiltersShown,
        makeSelectorModalIsOpen: state.pages.dealList.showMakeSelectorModal,
        searchQuery: state.pages.dealList.searchQuery,
        userLocation: getUserLocation(state),
        selectedFiltersByCategory: getSelectedFiltersByCategory(state),
        isLoading: getIsPageLoading(state),
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
