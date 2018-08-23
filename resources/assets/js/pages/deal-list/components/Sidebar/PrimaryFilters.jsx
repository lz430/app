import React from 'react';
import PropTypes from 'prop-types';
import ArrowOutlineLeft from 'icons/zondicons/ArrowOutlineLeft';

import SidebarFilter from './SidebarFilter';
import FilterStyleList from './FilterStyleList';
import FilterMakeList from './FilterMakeList';
import { MediumAndUp } from '../../../../components/Responsive';

class PrimaryFilters extends React.PureComponent {
    static propTypes = {
        filters: PropTypes.object.isRequired,
        loadingSearchResults: PropTypes.bool.isRequired,
        selectedFiltersByCategory: PropTypes.object.isRequired,
        searchQuery: PropTypes.object.isRequired,
        onClearModelYear: PropTypes.func.isRequired,
        onToggleSearchFilter: PropTypes.func.isRequired,
    };

    state = {
        openFilter: null,
    };

    toggleOpenFilter(openFilter) {
        this.setState({
            openFilter:
                this.state.openFilter && this.state.openFilter === openFilter
                    ? null
                    : openFilter,
        });
    }

    render() {
        if (this.props.searchQuery.entity === 'deal') {
            return (
                <MediumAndUp>
                    <div className="filter-group filter-group__primary">
                        <div className="sidebar-filters__overlay">
                            <a
                                onClick={() => {
                                    this.props.onClearModelYear();
                                }}
                            >
                                <ArrowOutlineLeft
                                    height="20px"
                                    width="20px"
                                    className="sidebar-filters__clear-icon"
                                />
                                Return to original search
                            </a>
                        </div>
                    </div>
                </MediumAndUp>
            );
        }

        return (
            <div className="filter-group filter-group__primary">
                <SidebarFilter
                    toggle={() => this.toggleOpenFilter('Vehicle Style')}
                    open={
                        this.state.openFilter === 'Vehicle Style' &&
                        this.props.searchQuery.entity !== 'deal'
                    }
                    title="Vehicle Style"
                    selectedItems={this.props.selectedFiltersByCategory.style}
                >
                    <FilterStyleList
                        category="style"
                        items={this.props.filters.style}
                        selectedItems={
                            this.props.selectedFiltersByCategory.style
                        }
                        onToggleSearchFilter={this.props.onToggleSearchFilter}
                    />
                </SidebarFilter>

                <SidebarFilter
                    toggle={() => this.toggleOpenFilter('Make')}
                    open={
                        this.state.openFilter === 'Make' &&
                        this.props.searchQuery.entity !== 'deal'
                    }
                    title="Vehicle Brand"
                    selectedItems={this.props.selectedFiltersByCategory.make}
                >
                    <FilterMakeList
                        category="make"
                        items={this.props.filters.make}
                        selectedItems={
                            this.props.selectedFiltersByCategory.make
                        }
                        onToggleSearchFilter={this.props.onToggleSearchFilter}
                    />
                </SidebarFilter>
            </div>
        );
    }
}

export default PrimaryFilters;
