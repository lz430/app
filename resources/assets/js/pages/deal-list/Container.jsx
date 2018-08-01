import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Loading from 'icons/miscicons/Loading';

import { StickyContainer } from 'react-sticky';
import util from 'src/util';

import { getUserLocation } from 'apps/user/selectors';
import { getIsPageLoading } from 'apps/page/selectors';

import Deals from './components/Deals';
import ToolbarSelectedFilters from './components/ToolbarSelectedFilters';
import ToolbarPrice from './components/ToolbarPrice';
import FilterPanel from './components/FilterPanel';
import NoDealsOutOfRange from './components/NoDealsOutOfRange';
import ModalMakeSelector from './components/ModalMakeSelector';

import {
    initDealListData,
    closeMakeSelectorModal,
    toggleSearchFilter,
} from './actions';
import { getSelectedFiltersByCategory } from './selectors';
import { filterItemType } from 'types';
import classNames from 'classnames';

class Container extends React.PureComponent {
    static propTypes = {
        searchQuery: PropTypes.object.isRequired,
        makeSelectorModalIsOpen: PropTypes.bool,
        smallFiltersShown: PropTypes.bool,
        selectedFiltersByCategory: PropTypes.object,
        userLocation: PropTypes.object.isRequired,
        isLoading: PropTypes.bool,
        makes: PropTypes.arrayOf(filterItemType),
        fallbackLogoImage: PropTypes.string.isRequired,
        onInit: PropTypes.func.isRequired,
        onToggleSearchFilter: PropTypes.func.isRequired,
        onCloseMakeSelectorModal: PropTypes.func.isRequired,
    };

    componentDidMount() {
        this.props.onInit();
    }

    renderPageLoadingIcon() {
        return <Loading />;
    }

    renderMakeSelectionModal() {
        return (
            <ModalMakeSelector
                toggle={this.props.onCloseMakeSelectorModal}
                isOpen={this.props.makeSelectorModalIsOpen}
                selectedFiltersByCategory={this.props.selectedFiltersByCategory}
                makes={this.props.makes}
                onToggleSearchFilter={this.props.onToggleSearchFilter}
                fallbackLogoImage={this.props.fallbackLogoImage}
            />
        );
    }

    renderFilterPanel() {
        const className = classNames({
            'filter-page__filter-panel': true,
            'filter-page__filter-panel--small': !util.windowIsLargerThanSmall(
                this.props.window.width
            ),
            'filter-page__filter-panel--small-filters-shown':
                !util.windowIsLargerThanSmall(this.props.window.width) &&
                this.props.smallFiltersShown,
            'filter-page__filter-panel--small-filters-hidden':
                !util.windowIsLargerThanSmall(this.props.window.width) &&
                !this.props.smallFiltersShown,
        });

        return (
            <div className={className}>
                <FilterPanel />
            </div>
        );
    }

    renderDeals() {
        const className = classNames({
            'filter-page__deals': true,
            'filter-page__deals--small': !util.windowIsLargerThanSmall(
                this.props.window.width
            ),
            'filter-page__deals--small-filters-shown':
                !util.windowIsLargerThanSmall(this.props.window.width) &&
                this.props.smallFiltersShown,
            'filter-page__deals--small-filters-hidden':
                !util.windowIsLargerThanSmall(this.props.window.width) &&
                !this.props.smallFiltersShown,
        });

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
            !this.props.userLocation ||
            (this.props.userLocation.latitude &&
                !this.props.userLocation.has_results)
        ) {
            return <NoDealsOutOfRange />;
        }

        return (
            <StickyContainer>
                {this.renderMakeSelectionModal()}
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
        makes: state.pages.dealList.filters.make,
        fallbackLogoImage: state.common.fallbackLogoImage,
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
        onToggleSearchFilter: item => {
            return dispatch(toggleSearchFilter('make', item));
        },
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Container);
