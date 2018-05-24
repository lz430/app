import React from 'react';
import SidebarFilter from 'components/SidebarFilter';
import ZipcodeFinder from 'components/ZipcodeFinder';
import FilterClose from 'components/FilterClose';
import FilterStyleSelector from 'components/FilterStyleSelector';
import FilterMakeSelector from 'components/FilterMakeSelector';
import FilterFuelTypeSelector from 'components/FilterFuelTypeSelector';
import FilterFeatureSelector from 'components/FilterFeatureSelector';
import FilterTransmissionTypeSelector from 'components/FilterTransmissionTypeSelector';
import { connect } from 'react-redux';
import * as Actions from 'actions/index';
import R from 'ramda';
import SVGInline from 'react-svg-inline';
import zondicons from 'zondicons';
import util from 'src/util';

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
                let categoryFeatures = category.relationships.features.data.map(categoryFeature => {
                    return categoryFeature.id;
                });

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
            this.props.selectedFeatures
        ).length;
    }

    renderSidebarFilters() {
        return this.props.featureCategories.map((category, index) => {
            if (category.attributes.slug === 'vehicle_size') {
                return;
            }

            let features = this.props.searchFeatures.filter(feature => {
                let categoryFeatures = category.relationships.features.data.map(categoryFeature => {
                    return categoryFeature.id;
                });

                return categoryFeatures.includes(feature.id);
            });

            let localSelectedFeatures = features.filter(feature => {
                return R.contains(
                    feature.attributes.title,
                    this.props.selectedFeatures
                );
            });

            return (
                <SidebarFilter
                    key={index}
                    toggle={() => this.toggleOpenFilter(category.attributes.title)}
                    open={true}
                    canToggle={false}
                    title={category.attributes.title}
                    count={localSelectedFeatures.length}
                >
                    <FilterFeatureSelector
                        selectedFeatures={this.props.selectedFeatures}
                        features={features}
                        onSelectFeature={this.props.toggleFeature}
                    />
                </SidebarFilter>
            )
        });
    }

    render() {
        let selectedSizeFeatures = this.state.sizeFeatures.filter(feature => {
            return R.contains(
                feature.attributes.title,
                this.props.selectedFeatures
            );
        });
        return (
            <div>
                {util.windowIsLargerThanSmall(this.props.window.width) ? (
                    null
                ) : (
                    <FilterClose />
                )}

                <ZipcodeFinder />

                <div className="sidebar-filters">
                    <div className={`sidebar-filters__broad sidebar-filters__broad--${this.props.filterPage === 'deals' ? 'narrow' : 'broad'}`}>
                        {
                            this.props.filterPage === 'deals' ? (
                                <div className="sidebar-filters__overlay">
                                    <a onClick={ () => {this.props.clearModelYear()} }>
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
                                <div className="sidebar-filters__instructive-heading">Refine this search</div>
                            )
                        }

                        <SidebarFilter
                            toggle={() => this.toggleOpenFilter('Vehicle Style')}
                            open={this.state.openFilter === 'Vehicle Style' && this.props.filterPage !== 'deals' }
                            title="Vehicle Style"
                            count={this.props.selectedStyles.length}
                        >
                            <FilterStyleSelector
                                styles={this.props.bodyStyles}
                                selectedStyles={this.props.selectedStyles}
                                onSelectStyle={this.props.toggleStyle}
                            />
                        </SidebarFilter>

                        {/*this.state.sizeCategory */ false ? (
                                <SidebarFilter
                                    toggle={() => this.toggleOpenFilter(this.state.sizeCategory.attributes.title)}
                                    open={this.state.openFilter === this.state.sizeCategory.attributes.title && this.props.filterPage !== 'deals' }
                                    title={this.state.sizeCategory.attributes.title}
                                    count={selectedSizeFeatures.length}
                                >
                                    <FilterFeatureSelector
                                        selectedFeatures={this.props.selectedFeatures}
                                        features={this.state.sizeFeatures}
                                        onSelectFeature={this.props.toggleFeature}
                                    />
                                </SidebarFilter>
                        ) : (<div></div>) }

                        <SidebarFilter
                            toggle={() => this.toggleOpenFilter('Make')}
                            open={this.state.openFilter === 'Make' && this.props.filterPage !== 'deals' }
                            title="Vehicle Brand"
                            count={this.props.selectedMakes.length}
                        >
                            <FilterMakeSelector
                                makes={this.props.makes}
                                selectedMakes={this.props.selectedMakes}
                                onSelectMake={this.props.toggleMake}
                            />
                        </SidebarFilter>
                    </div>
                    <div className={`sidebar-filters__narrow sidebar-filters__narrow--${status}`}>
                        { this.props.filterPage === 'deals' ? (
                            <div className="sidebar-filters__instructive-heading">Refine this search</div>
                        ) : (
                            ''
                        ) }

                        <div className="sidebar-filters__section-header sidebar-filters__filter-title">
                            <p>Features & Options</p>
                        </div>
                        { this.renderSidebarFilters() }
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state, ownProps) => {
    return {
        dealsByMakeModelYear: state.dealsByMakeModelYear,
        makes: state.makes,
        models: state.models,
        filterPage: state.filterPage,
        fuelTypes: state.fuelTypes,
        selectedFuelType: state.selectedFuelType,
        transmissionTypes: state.transmissionTypes,
        selectedTransmissionType: state.selectedTransmissionType,
        bodyStyles: state.bodyStyles,
        segments: state.segments,
        selectedSegment: state.selectedSegment,
        selectedYear: state.selectedYear,
        selectedStyles: state.selectedStyles,
        selectedMakes: state.selectedMakes,
        selectedModels: state.selectedModels,
        fallbackLogoImage: state.fallbackLogoImage,
        selectedFeatures: state.selectedFeatures,
        features: state.features,
        featureCategories: state.featureCategories,
        searchFeatures: state.searchFeatures,
        window: state.window,
    };
};

export default connect(mapStateToProps, Actions)(FilterPanel);
