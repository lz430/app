import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { filterItemType } from 'types';
import Loading from 'icons/miscicons/Loading';

import { StickyContainer } from 'react-sticky';

import { getUserLocation, getUserPurchaseStrategy } from 'apps/user/selectors';
import { getIsPageLoading } from 'apps/page/selectors';

import Deals from './components/Deals';
import ToolbarSelectedFilters from './components/ToolbarSelectedFilters';
import ToolbarMobileBottom from './components/ToolbarMobile/ToolbarMobileBottom';

import FilterPanel from './components/FilterPanel';
import NoDealsOutOfRange from './components/NoDealsOutOfRange';
import ModalMakeSelector from './components/ModalMakeSelector';

import { LargeAndUp, MediumAndDown } from 'components/Responsive';
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
import PageContent from 'components/App/PageContent';

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

    renderDeals() {
        return (
            <div className="filter-page__deals">
                <ToolbarSelectedFilters />
                <Deals />
            </div>
        );
    }

    renderFilterPanelAndDeals() {
        return (
            <StickyContainer className="filter-page">
                <LargeAndUp>
                    <FilterPanel />
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
