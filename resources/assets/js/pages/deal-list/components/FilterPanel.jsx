import React from 'react';

import { connect } from 'react-redux';
import R from 'ramda';

import ZipcodeFinder from './ZipcodeFinder';
import SidebarFilter from './SidebarFilter';
import FilterClose from './FilterClose';
import FilterStyleSelector from './FilterStyleSelector';
import FilterMakeSelector from './FilterMakeSelector';
import FilterFeatureSelector from './FilterFeatureSelector';

import SVGInline from 'react-svg-inline';
import zondicons from 'zondicons';
import util from 'src/util';

import {
    toggleStyle,
    toggleFeature,
    toggleMake,
    clearModelYear,
} from 'pages/deal-list/actions';

class FilterPanel extends React.PureComponent {
    constructor(props) {
        super(props);

        this.state = {
            openFilter: null,
            sizeCategory: null,
            sizeFeatures: [],
        };
    }

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

    getFeaturesByGroup(group) {
        return R.filter(feature => {
            return R.path(['attributes', 'group'], feature) === group;
        }, this.props.features || []);
    }

    getCountOfSelectedFeatureByGroup(group) {
        return R.intersection(
            R.map(
                R.path(['attributes', 'feature']),
                this.getFeaturesByGroup(group)
            ),
            this.props.searchQuery.features
        ).length;
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
                    <FilterClose />
                )}

                <ZipcodeFinder />

                <div className="sidebar-filters">
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
                            toggle={() =>
                                this.toggleOpenFilter('Vehicle Style')
                            }
                            open={
                                this.state.openFilter === 'Vehicle Style' &&
                                this.props.searchQuery.entity !== 'deal'
                            }
                            title="Vehicle Style"
                            count={this.props.searchQuery.styles.length}
                        >
                            <FilterStyleSelector
                                styles={this.props.bodyStyles}
                                selectedStyles={this.props.searchQuery.styles}
                                onSelectStyle={this.props.onToggleStyle}
                            />
                        </SidebarFilter>

                        {/*this.state.sizeCategory */ false ? (
                            <SidebarFilter
                                toggle={() =>
                                    this.toggleOpenFilter(
                                        this.state.sizeCategory.attributes.title
                                    )
                                }
                                open={
                                    this.state.openFilter ===
                                        this.state.sizeCategory.attributes
                                            .title &&
                                    this.props.searchQuery.entity !== 'deal'
                                }
                                title={this.state.sizeCategory.attributes.title}
                                count={selectedSizeFeatures.length}
                            >
                                <FilterFeatureSelector
                                    selectedFeatures={
                                        this.props.searchQuery.features
                                    }
                                    features={this.state.sizeFeatures}
                                    onSelectFeature={this.props.toggleFeature}
                                />
                            </SidebarFilter>
                        ) : (
                            <div />
                        )}

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
                                makes={this.props.makes}
                                selectedMakes={this.props.searchQuery.makes}
                                onSelectMake={this.props.onToggleMake}
                            />
                        </SidebarFilter>
                    </div>
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
        makes: state.pages.dealList.makes,
        models: state.pages.dealList.models,
        bodyStyles: state.pages.dealList.bodyStyles,
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
