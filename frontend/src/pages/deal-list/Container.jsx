import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { StickyContainer } from 'react-sticky';
import ReactRouterPropTypes from 'react-router-prop-types';
import PropTypes from 'prop-types';
import { dealType, filterItemType, nextRouterType } from '../../types';
import Loading from '../../icons/miscicons/Loading';

import {
    getUserLocation,
    getUserPurchaseStrategy,
} from '../../apps/user/selectors';
import { getIsPageLoading } from '../../apps/page/selectors';
import PageContent from '../../components/App/PageContent';

import ResultsList from './components/ResultsList';
import ToolbarSelectedFilters from './components/ToolbarSelectedFilters';
import ToolbarMobileBottom from './components/ToolbarMobile/ToolbarMobileBottom';

import FilterPanel from './components/FilterPanel';
import NoDealsOutOfRange from './components/NoDealsOutOfRange';
import ModalMakeSelector from './components/ModalMakeSelector';
import { LargeAndUp, MediumAndDown } from '../../components/Responsive';
import { buildSearchQueryUrl } from './helpers';
import { forceCheck } from 'react-lazyload';

import {
    initDealListData,
    updateEntirePageState,
    closeMakeSelectorModal,
    toggleSearchFilter,
    clearModelYear,
    requestSearch,
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
import Router from 'next/router';

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
        router: nextRouterType,
    };

    componentDidMount() {
        this.props.onInit({ router: this.props.router });

        Router.beforePopState(({ url, as, options }) => {
            console.log('beforePopState');
            console.log(url);
            console.log(as);
            console.log(options);
            return true;
        });
    }

    componentDidUpdate(prevProps) {
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

        /*
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
            } else {
                this.props.onInit({
                    location: this.props.location,
                    dataOnly: true,
                });
            }
        }
        */
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
                    <ToolbarMobileBottom />
                </MediumAndDown>
            </StickyContainer>
        );
    }

    render() {
        if (this.props.isLoading) {
            return (
                <PageContent desktopOnlyFooter={true}>
                    <Loading />
                </PageContent>
            );
        }

        if (this.props.modelYears === false || this.props.deals === false) {
            return (
                <PageContent desktopOnlyFooter={true}>
                    <h1 className="mb-5 mt-5 text-center">
                        Unable to fetch results.
                    </h1>
                </PageContent>
            );
        }

        if (
            !this.props.userLocation ||
            (this.props.userLocation.latitude &&
                !this.props.userLocation.has_results)
        ) {
            return (
                <PageContent desktopOnlyFooter={true}>
                    <NoDealsOutOfRange />
                </PageContent>
            );
        }

        return (
            <PageContent desktopOnlyFooter={true}>
                {this.renderFilterPanelAndDeals()}
                {this.renderMakeSelectionModal()}
            </PageContent>
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
        fallbackLogoImage: state.common.fallbackLogoImage,
        isLoading: getIsPageLoading(state),
        filters: state.pages.dealList.filters,
        loadingSearchResults: getLoadingSearchResults(state),
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
