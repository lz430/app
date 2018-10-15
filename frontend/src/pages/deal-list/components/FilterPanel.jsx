import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import PrimaryFilters from './Sidebar/PrimaryFilters';
import SecondaryFilters from './Sidebar/SecondaryFilters';
import MobileFilterClose from './Sidebar/MobileFilterClose';
import GlobalSelectPurchaseStrategy from 'apps/user/components/GlobalSelectPurchaseStrategy';

import { toggleSearchFilter, clearModelYear } from 'pages/deal-list/actions';
import {
    getLoadingSearchResults,
    getSelectedFiltersByCategory,
} from '../selectors';
import { requestSearch } from '../actions';

import classNames from 'classnames';

class FilterPanel extends React.PureComponent {
    static propTypes = {
        filters: PropTypes.object.isRequired,
        loadingSearchResults: PropTypes.bool.isRequired,
        selectedFiltersByCategory: PropTypes.object.isRequired,
        searchQuery: PropTypes.object.isRequired,
        onClearModelYear: PropTypes.func.isRequired,
        onToggleSearchFilter: PropTypes.func.isRequired,
        onRequestSearch: PropTypes.func.isRequired,
        isMobile: PropTypes.bool.isRequired,
        isOpen: PropTypes.bool.isRequired,
        onToggleOpen: PropTypes.func,
    };

    static defaultProps = {
        isMobile: false,
        isOpen: false,
    };

    state = {
        openFilter: null,
        sizeCategory: null,
        sizeFeatures: [],
    };

    afterSetPurchaseStrategy() {
        this.props.onRequestSearch();
    }

    render() {
        const className = classNames({
            'filter-page__filter-panel': true,
            'filter-page__filter-panel--small': this.props.isMobile,
            'filter-page__filter-panel--small-filters-shown': this.props.isOpen,
            'filter-page__filter-panel--small-filters-hidden': !this.props
                .isOpen,
        });

        return (
            <div className={className}>
                <div className="sidebar-filters">
                    {this.props.isMobile && (
                        <MobileFilterClose
                            onToggleOpen={this.props.onToggleOpen}
                        />
                    )}

                    {/*
                    Purchase Strategy
                    */}
                    {!this.props.isMobile && (
                        <div className="filter-group filter-group__purchase-strategy">
                            <GlobalSelectPurchaseStrategy
                                showExplanation={true}
                                afterSetPurchaseStrategy={this.afterSetPurchaseStrategy.bind(
                                    this
                                )}
                            />
                        </div>
                    )}

                    {/*
                    Primary Filters
                    */}
                    <PrimaryFilters
                        searchQuery={this.props.searchQuery}
                        filters={this.props.filters}
                        loadingSearchResults={this.props.loadingSearchResults}
                        selectedFiltersByCategory={
                            this.props.selectedFiltersByCategory
                        }
                        onClearModelYear={this.props.onClearModelYear}
                        onToggleSearchFilter={this.props.onToggleSearchFilter}
                    />

                    {/*
                    Secondary Filters
                    */}
                    <SecondaryFilters
                        searchQuery={this.props.searchQuery}
                        filters={this.props.filters}
                        loadingSearchResults={this.props.loadingSearchResults}
                        selectedFiltersByCategory={
                            this.props.selectedFiltersByCategory
                        }
                        onToggleSearchFilter={this.props.onToggleSearchFilter}
                    />

                    {this.props.isMobile && (
                        <MobileFilterClose
                            onToggleOpen={this.props.onToggleOpen}
                        />
                    )}
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        filters: state.pages.dealList.filters,
        searchQuery: state.pages.dealList.searchQuery,
        selectedFiltersByCategory: getSelectedFiltersByCategory(state),
        loadingSearchResults: getLoadingSearchResults(state),
    };
};

const mapDispatchToProps = dispatch => {
    return {
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

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(FilterPanel);
