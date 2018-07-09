import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import ZipcodeFinder from './Sidebar/ZipcodeFinder';
import PrimaryFilters from './Sidebar/PrimaryFilters';
import SecondaryFilters from './Sidebar/SecondaryFilters';
import MobileFilterClose from './Sidebar/MobileFilterClose';

import util from 'src/util';

import { toggleSearchFilter, clearModelYear } from 'pages/deal-list/actions';
import { getSelectedFiltersByCategory } from '../selectors';

class FilterPanel extends React.PureComponent {
    static propTypes = {
        filters: PropTypes.object.isRequired,
        selectedFiltersByCategory: PropTypes.object.isRequired,
        searchQuery: PropTypes.object.isRequired,
        onClearModelYear: PropTypes.func.isRequired,
        onToggleSearchFilter: PropTypes.func.isRequired,
    };

    state = {
        openFilter: null,
        sizeCategory: null,
        sizeFeatures: [],
    };

    render() {
        return (
            <div>
                {util.windowIsLargerThanSmall(
                    this.props.window.width
                ) ? null : (
                    <MobileFilterClose />
                )}

                {/*
                Location
                */}

                <ZipcodeFinder />

                <div className="sidebar-filters">
                    {/*
                    Primary Filters
                    */}
                    <PrimaryFilters
                        searchQuery={this.props.searchQuery}
                        filters={this.props.filters}
                        selectedFiltersByCategory={
                            this.props.selectedFiltersByCategory
                        }
                        onClearModelYear={this.props.onClearModelYear}
                        onToggleSearchFilter={this.props.onToggleSearchFilter}
                    />

                    <div
                        className={`sidebar-filters__narrow sidebar-filters__narrow--${status}`}
                    >
                        {this.props.searchQuery.entity === 'deal' ? (
                            <div className="sidebar-filters__instructive-heading">
                                Refine this search
                            </div>
                        ) : (
                            ''
                        )}

                        <div className="sidebar-filters__section-header sidebar-filters__filter-title">
                            <p>Features & Options</p>
                        </div>
                        <SecondaryFilters
                            searchQuery={this.props.searchQuery}
                            filters={this.props.filters}
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
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(FilterPanel);
