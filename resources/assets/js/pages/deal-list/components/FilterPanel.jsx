import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import ZipcodeFinder from './Sidebar/ZipcodeFinder';
import PrimaryFilters from './Sidebar/PrimaryFilters';
import SecondaryFilters from './Sidebar/SecondaryFilters';
import MobileFilterClose from './Sidebar/MobileFilterClose';

import util from 'src/util';

import {
    toggleStyle,
    toggleFeature,
    toggleMake,
    clearModelYear,
} from 'pages/deal-list/actions';

class FilterPanel extends React.PureComponent {
    static propTypes = {
        filters: PropTypes.object.isRequired,
        searchQuery: PropTypes.object.isRequired,
        onClearModelYear: PropTypes.func.isRequired,
        onToggleStyle: PropTypes.func.isRequired,
        onToggleMake: PropTypes.func.isRequired,
        onToggleFeature: PropTypes.func.isRequired,
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
                        onClearModelYear={this.props.onClearModelYear}
                        onToggleMake={this.props.onToggleMake}
                        onToggleStyle={this.props.onToggleStyle}
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
                            onToggleFeature={this.props.onToggleFeature}
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
    };
};

const mapDispatchToProps = dispatch => {
    return {
        onToggleStyle: data => {
            return dispatch(toggleStyle(data));
        },
        onToggleFeature: data => {
            return dispatch(toggleFeature(data));
        },
        onToggleMake: data => {
            return dispatch(toggleMake(data));
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
