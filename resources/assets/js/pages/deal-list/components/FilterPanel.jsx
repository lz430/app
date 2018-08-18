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

import { MediumAndUp, SmallAndDown } from 'components/Responsive';

class FilterPanel extends React.PureComponent {
    static propTypes = {
        filters: PropTypes.object.isRequired,
        loadingSearchResults: PropTypes.bool.isRequired,
        selectedFiltersByCategory: PropTypes.object.isRequired,
        searchQuery: PropTypes.object.isRequired,
        onClearModelYear: PropTypes.func.isRequired,
        onToggleSearchFilter: PropTypes.func.isRequired,
        onRequestSearch: PropTypes.func.isRequired,
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
        return (
            <div>
                <SmallAndDown>
                    <MobileFilterClose />
                </SmallAndDown>

                <div className="sidebar-filters">
                    {/*
                    Purchase Strategy
                    */}
                    <MediumAndUp>
                        <div className="purchase-strategy">
                            <GlobalSelectPurchaseStrategy
                                showExplanation={true}
                                afterSetPurchaseStrategy={this.afterSetPurchaseStrategy.bind(
                                    this
                                )}
                            />
                        </div>
                    </MediumAndUp>

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

                    <div className="sidebar-filters__narrow">
                        <SecondaryFilters
                            searchQuery={this.props.searchQuery}
                            filters={this.props.filters}
                            loadingSearchResults={
                                this.props.loadingSearchResults
                            }
                            selectedFiltersByCategory={
                                this.props.selectedFiltersByCategory
                            }
                            onToggleSearchFilter={
                                this.props.onToggleSearchFilter
                            }
                        />
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        filters: state.pages.dealList.filters,
        window: state.common.window,
        searchQuery: state.pages.dealList.searchQuery,
        selectedFiltersByCategory: getSelectedFiltersByCategory(state),
        smallFiltersShown: state.common.smallFiltersShown,
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
