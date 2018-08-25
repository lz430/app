import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { filterItemType } from 'types';
import classNames from 'classnames';
import Loading from 'icons/miscicons/Loading';

import { StickyContainer } from 'react-sticky';
import util from 'src/util';

import { getUserLocation, getUserPurchaseStrategy } from 'apps/user/selectors';
import { getIsPageLoading } from 'apps/page/selectors';

import Deals from './components/Deals';
import ToolbarSelectedFilters from './components/ToolbarSelectedFilters';
import ToolbarMobileBottom from './components/ToolbarMobile/ToolbarMobileBottom';

import FilterPanel from './components/FilterPanel';
import NoDealsOutOfRange from './components/NoDealsOutOfRange';
import ModalMakeSelector from './components/ModalMakeSelector';

import { MediumAndDown } from 'components/Responsive';
import { buildSearchQueryUrl } from './helpers';
import { forceCheck } from 'react-lazyload';

import {
    initDealListData,
    updateEntirePageState,
    closeMakeSelectorModal,
    toggleSearchFilter,
} from './actions';

import { getSearchQuery, getSelectedFiltersByCategory } from './selectors';
import { setPurchaseStrategy } from 'apps/user/actions';

class Container extends React.PureComponent {
    static propTypes = {
        purchaseStrategy: PropTypes.string.isRequired,
        searchQuery: PropTypes.object.isRequired,
        makeSelectorModalIsOpen: PropTypes.bool,
        smallFiltersShown: PropTypes.bool,
        selectedFiltersByCategory: PropTypes.object,
        userLocation: PropTypes.object.isRequired,
        isLoading: PropTypes.bool,
        makes: PropTypes.arrayOf(filterItemType),
        fallbackLogoImage: PropTypes.string.isRequired,
        onInit: PropTypes.func.isRequired,
        onUpdateEntirePageState: PropTypes.func.isRequired,
        onSetPurchaseStrategy: PropTypes.func.isRequired,
        onToggleSearchFilter: PropTypes.func.isRequired,
        onCloseMakeSelectorModal: PropTypes.func.isRequired,
    };

    componentDidMount() {
        this.props.onInit(this.props.location);
    }

    componentDidUpdate(prevProps) {
        if (this.props.location.search !== prevProps.location.search) {
            // Handling user clicking back button here.
            const expectedQuery = buildSearchQueryUrl(this.props.searchQuery);
            if (
                expectedQuery &&
                '?' + expectedQuery !== this.props.location.search &&
                this.props.location.state &&
                this.props.location.state.query
            ) {
                this.props.onSetPurchaseStrategy(
                    this.props.location.state.query.purchaseStrategy
                );

                this.props.onUpdateEntirePageState(
                    this.props.location.state.page
                );

                forceCheck();
            }
        }
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
                <ToolbarSelectedFilters />
                <Deals />
            </div>
        );
    }

    renderFilterPanelAndDeals() {
        return (
            <div className="filter-page">
                {this.renderFilterPanel()}
                {this.renderDeals()}
                <MediumAndDown>
                    <ToolbarMobileBottom />
                </MediumAndDown>
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
        searchQuery: getSearchQuery(state),
        userLocation: getUserLocation(state),
        selectedFiltersByCategory: getSelectedFiltersByCategory(state),
        purchaseStrategy: getUserPurchaseStrategy(state),
        makes: state.pages.dealList.filters.make,
        fallbackLogoImage: state.common.fallbackLogoImage,
        isLoading: getIsPageLoading(state),
    };
};

const mapDispatchToProps = dispatch => {
    return {
        onInit: url => {
            return dispatch(initDealListData(url));
        },

        onUpdateEntirePageState: data => {
            return dispatch(updateEntirePageState(data));
        },
        onCloseMakeSelectorModal: () => {
            return dispatch(closeMakeSelectorModal());
        },
        onSetPurchaseStrategy: strategy => {
            return dispatch(setPurchaseStrategy(strategy));
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
