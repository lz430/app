import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import R from 'ramda';

import ZipcodeFinder from './Sidebar/ZipcodeFinder';
import PrimaryFilters from './Sidebar/PrimaryFilters';
import SidebarFilter from './Sidebar/SidebarFilter';
import MobileFilterClose from './Sidebar/MobileFilterClose';

import FilterFeatureSelector from './Sidebar/FilterFeatureSelector';

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
    };

    state = {
        openFilter: null,
        sizeCategory: null,
        sizeFeatures: [],
    };

    componentWillReceiveProps() {
        this.props.featureCategories.map((category, index) => {
            let features = this.props.searchFeatures.filter(feature => {
                let categoryFeatures = category.relationships.features.data.map(
                    categoryFeature => {
                        return categoryFeature.id;
                    }
                );

                return categoryFeatures.includes(feature.id);
            });

            if (category.attributes.slug === 'vehicle_size') {
                this.setState({
                    sizeCategory: category,
                    sizeFeatures: features,
                });

                return;
            }
        });
    }

    toggleOpenFilter(openFilter) {
        this.setState({
            openFilter:
                this.state.openFilter && this.state.openFilter === openFilter
                    ? null
                    : openFilter,
        });
    }

    renderSidebarFilters() {
        return this.props.featureCategories.map((category, index) => {
            if (category.attributes.slug === 'vehicle_size') {
                return;
            }

            let features = this.props.searchFeatures.filter(feature => {
                let categoryFeatures = category.relationships.features.data.map(
                    categoryFeature => {
                        return categoryFeature.id;
                    }
                );

                return categoryFeatures.includes(feature.id);
            });

            let localSelectedFeatures = features.filter(feature => {
                return R.contains(
                    feature.attributes.title,
                    this.props.searchQuery.features
                );
            });
            return (
                <SidebarFilter
                    key={index}
                    toggle={() =>
                        this.toggleOpenFilter(category.attributes.title)
                    }
                    open={true}
                    canToggle={false}
                    title={category.attributes.title}
                    count={localSelectedFeatures.length}
                >
                    <FilterFeatureSelector
                        selectedFeatures={this.props.searchQuery.features}
                        features={features}
                        onSelectFeature={this.props.onToggleFeature}
                    />
                </SidebarFilter>
            );
        });
    }

    render() {
        let selectedSizeFeatures = this.state.sizeFeatures.filter(feature => {
            return R.contains(
                feature.attributes.title,
                this.props.searchQuery.features
            );
        });
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
                        {this.renderSidebarFilters()}
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        filters: state.pages.dealList.filters,
        makes: state.pages.dealList.filters.make,
        models: state.pages.dealList.models,
        bodyStyles: state.pages.dealList.filters.style,
        features: state.pages.dealList.features,
        featureCategories: state.pages.dealList.featureCategories,
        searchFeatures: state.pages.dealList.searchFeatures,
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
