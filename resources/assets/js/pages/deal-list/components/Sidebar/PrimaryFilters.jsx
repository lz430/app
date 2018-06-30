import React from 'react';
import PropTypes from 'prop-types';
import SVGInline from 'react-svg-inline';
import zondicons from 'zondicons';

import SidebarFilter from './SidebarFilter';
import FilterStyleSelector from './FilterStyleSelector';
import FilterMakeSelector from './FilterMakeSelector';

class PrimaryFilters extends React.PureComponent {
    static propTypes = {
        filters: PropTypes.object.isRequired,
        searchQuery: PropTypes.object.isRequired,
        onClearModelYear: PropTypes.func.isRequired,
        onToggleStyle: PropTypes.func.isRequired,
        onToggleMake: PropTypes.func.isRequired,
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
        return (
            <div
                className={`sidebar-filters__broad sidebar-filters__broad--${
                    this.props.searchQuery.entity === 'deal'
                        ? 'narrow'
                        : 'broad'
                }`}
            >
                {this.props.searchQuery.entity === 'deal' ? (
                    <div className="sidebar-filters__overlay">
                        <a
                            onClick={() => {
                                this.props.onClearModelYear();
                            }}
                        >
                            <SVGInline
                                height="20px"
                                width="20px"
                                className="sidebar-filters__clear-icon"
                                svg={zondicons['arrow-outline-left']}
                            />
                            Return to original search
                        </a>
                    </div>
                ) : (
                    <div className="sidebar-filters__instructive-heading">
                        Refine this search
                    </div>
                )}

                <SidebarFilter
                    toggle={() => this.toggleOpenFilter('Vehicle Style')}
                    open={
                        this.state.openFilter === 'Vehicle Style' &&
                        this.props.searchQuery.entity !== 'deal'
                    }
                    title="Vehicle Style"
                    count={this.props.searchQuery.styles.length}
                >
                    <FilterStyleSelector
                        styles={this.props.filters.style}
                        selectedStyles={this.props.searchQuery.styles}
                        onSelectStyle={this.props.onToggleStyle}
                    />
                </SidebarFilter>

                <SidebarFilter
                    toggle={() => this.toggleOpenFilter('Make')}
                    open={
                        this.state.openFilter === 'Make' &&
                        this.props.searchQuery.entity !== 'deal'
                    }
                    title="Vehicle Brand"
                    count={this.props.searchQuery.makes.length}
                >
                    <FilterMakeSelector
                        makes={this.props.filters.make}
                        selectedMakes={this.props.searchQuery.makes}
                        onSelectMake={this.props.onToggleMake}
                    />
                </SidebarFilter>
            </div>
        );
    }
}

export default PrimaryFilters;
