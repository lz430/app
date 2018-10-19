import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { StickyContainer } from 'react-sticky';
import PropTypes from 'prop-types';
import { dealType, filterItemType, nextRouterType } from '../../core/types';
import Loading from '../../components/Loading';

import {
    getUserLocation,
    getUserPurchaseStrategy,
} from '../../apps/user/selectors';
import { getIsPageLoading } from '../../apps/page/selectors';

import ResultsList from './components/ResultsList';
import ToolbarSelectedFilters from './components/ToolbarSelectedFilters';
import ToolbarMobileBottom from './components/ToolbarMobile/ToolbarMobileBottom';

import FilterPanel from './components/FilterPanel';
import NoDealsOutOfRange from './components/NoDealsOutOfRange';
import ModalMakeSelector from './components/ModalMakeSelector';
import { LargeAndUp, MediumAndDown } from '../../components/Responsive';
import { forceCheck } from 'react-lazyload';

import {
    initDealListData,
    updateEntirePageState,
    closeMakeSelectorModal,
    toggleSearchFilter,
    clearModelYear,
    requestSearch,
    toggleSearchSort,
} from './actions';

import {
    getAllMakes,
    getLoadingSearchResults,
    getSearchQuery,
    getSelectedFiltersByCategory,
} from './selectors';
import { setPurchaseStrategy } from '../../apps/user/actions';
import ListTopMessaging from './components/Cta/ListTopMessaging';
import withTracker from '../../components/withTracker';
import { withRouter } from 'next/router';
import dealPage from './selectors';

class Container extends React.Component {
    static propTypes = {
        filters: PropTypes.object.isRequired,
        purchaseStrategy: PropTypes.string.isRequired,
        loadingSearchResults: PropTypes.bool.isRequired,
        searchQuery: PropTypes.object.isRequired,
        modelYears: PropTypes.array,
        deals: PropTypes.arrayOf(dealType),
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
        onToggleMakeFilter: PropTypes.func.isRequired,
        onToggleSearchFilter: PropTypes.func.isRequired,
        onCloseMakeSelectorModal: PropTypes.func.isRequired,
        onRequestSearch: PropTypes.func.isRequired,
        onClearModelYear: PropTypes.func.isRequired,
        onToggleSearchSort: PropTypes.func.isRequired,
        router: nextRouterType,
        initialQuery: PropTypes.object,
        selectedMake: PropTypes.string,
    };

    componentDidMount() {
        this.props.onInit({ initialQuery: this.props.initialQuery });
    }

    componentDidUpdate() {
        if (this.props.router.beforePopState) {
            this.props.router.beforePopState(({ options }) => {
                const data = options.data;
                if (data) {
                    this.props.onSetPurchaseStrategy(
                        data.query.purchaseStrategy
                    );

                    this.props.onUpdateEntirePageState(data.page);

                    forceCheck();
                }

                return true;
            });
        }
    }

    onToggleSearchFilter(category, item) {
        this.props.onToggleSearchFilter(category, item);
    }

    onRequestSearch() {
        this.props.onRequestSearch(this.props.router);
    }

    renderMakeSelectionModal() {
        return (
            <ModalMakeSelector
                toggle={this.props.onCloseMakeSelectorModal}
                isOpen={this.props.makeSelectorModalIsOpen}
                selectedFiltersByCategory={this.props.selectedFiltersByCategory}
                makes={this.props.makes}
                onToggleSearchFilter={this.props.onToggleMakeFilter}
                fallbackLogoImage={this.props.fallbackLogoImage}
            />
        );
    }

    renderDeals() {
        return (
            <div className="filter-page__deals">
                <ToolbarSelectedFilters />
                <ListTopMessaging />
                <ResultsList />
            </div>
        );
    }

    renderFilterPanelAndDeals() {
        return (
            <StickyContainer className="filter-page">
                <LargeAndUp>
                    <FilterPanel
                        filters={this.props.filters}
                        searchQuery={this.props.searchQuery}
                        selectedFiltersByCategory={
                            this.props.selectedFiltersByCategory
                        }
                        loadingSearchResults={this.props.loadingSearchResults}
                        onToggleSearchFilter={this.onToggleSearchFilter.bind(
                            this
                        )}
                        onClearModelYear={this.props.onClearModelYear}
                        onRequestSearch={this.onRequestSearch.bind(this)}
                    />
                </LargeAndUp>
                {this.renderDeals()}
                <MediumAndDown>
                    <ToolbarMobileBottom
                        searchQuery={this.props.searchQuery}
                        selectedFiltersByCategory={
                            this.props.selectedFiltersByCategory
                        }
                        selectedMake={this.props.selectedMake}
                        purchaseStrategy={this.props.purchaseStrategy}
                        filters={this.props.filters}
                        loadingSearchResults={this.props.loadingSearchResults}
                        onToggleSearchFilter={this.onToggleSearchFilter.bind(
                            this
                        )}
                        onClearModelYear={this.props.onClearModelYear}
                        onRequestSearch={this.onRequestSearch.bind(this)}
                        onToggleSearchSort={this.props.onToggleSearchSort}
                        onSetPurchaseStrategy={this.props.onSetPurchaseStrategy}
                    />
                </MediumAndDown>
            </StickyContainer>
        );
    }

    render() {
        if (this.props.isLoading) {
            return <Loading />;
        }

        if (this.props.modelYears === false || this.props.deals === false) {
            return (
                <h1 className="mb-5 mt-5 text-center">
                    Unable to fetch results.
                </h1>
            );
        }

        if (
            !this.props.userLocation ||
            (this.props.userLocation.latitude &&
                !this.props.userLocation.has_results)
        ) {
            return <NoDealsOutOfRange />;
        }

        return (
            <React.Fragment>
                {this.renderFilterPanelAndDeals()}
                {this.renderMakeSelectionModal()}
            </React.Fragment>
        );
    }
}

const mapStateToProps = state => {
    return {
        smallFiltersShown: state.pages.dealList.smallFiltersShown,
        makeSelectorModalIsOpen: state.pages.dealList.showMakeSelectorModal,
        searchQuery: getSearchQuery(state),
        deals: state.pages.dealList.deals,
        modelYears: state.pages.dealList.modelYears,
        userLocation: getUserLocation(state),
        selectedFiltersByCategory: getSelectedFiltersByCategory(state),
        purchaseStrategy: getUserPurchaseStrategy(state),
        makes: getAllMakes(state),
        selectedMake: dealPage(state).selectedMake,
        fallbackLogoImage: state.common.fallbackLogoImage,
        isLoading: getIsPageLoading(state),
        filters: state.pages.dealList.filters,
        loadingSearchResults: getLoadingSearchResults(state),
    };
};

const mapDispatchToProps = dispatch => {
    return {
        onInit: initialQuery => {
            return dispatch(initDealListData(initialQuery));
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
        onToggleMakeFilter: item => {
            return dispatch(toggleSearchFilter('make', item));
        },
        onToggleSearchFilter: (category, item) => {
            return dispatch(toggleSearchFilter(category, item));
        },
        onClearModelYear: () => {
            return dispatch(clearModelYear());
        },
        onRequestSearch: () => {
            return dispatch(requestSearch());
        },
        onToggleSearchSort: sort => {
            return dispatch(toggleSearchSort(sort));
        },
    };
};

export default compose(
    withRouter,
    connect(
        mapStateToProps,
        mapDispatchToProps
    ),
    withTracker
)(Container);
