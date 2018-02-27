import React from 'react';
import SidebarFilter from 'components/SidebarFilter';
import ZipcodeFinder from 'components/ZipcodeFinder';
import FilterStyleSelector from 'components/FilterStyleSelector';
import FilterMakeSelector from 'components/FilterMakeSelector';
import FilterFuelTypeSelector from 'components/FilterFuelTypeSelector';
import FilterFeatureSelector from 'components/FilterFeatureSelector';
import FilterTransmissionTypeSelector from 'components/FilterTransmissionTypeSelector';
import FilterSegmentSelector from 'components/FilterSegmentSelector';
import { connect } from 'react-redux';
import * as Actions from 'actions/index';
import R from 'ramda';

class FilterPanel extends React.PureComponent {
    constructor(props) {
        super(props);

        this.state = {
            openFilter: 'Vehicle Style',
        };
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
            let features = this.props.searchFeatures.filter(feature => {
                let categoryFeatures = category.relationships.features.data.map(categoryFeature => {
                    return categoryFeature.id;
                });

                return categoryFeatures.includes(feature.id);
            });

            return (
                <SidebarFilter
                    key={index}
                    toggle={() => this.toggleOpenFilter(category.attributes.title)}
                    open={this.state.openFilter === category.attributes.title}
                    title={category.attributes.title}
                    count={this.props.selectedStyles.length}
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
        let status = this.props.dealsByMakeModelYear.length ? 'broad' : 'narrow';
        return (
            <div>
                <ZipcodeFinder />

                <div className="sidebar-filters">
                    <div className={`sidebar-filters__broad sidebar-filters__broad--${status}`}>
                        <SidebarFilter
                            toggle={() => this.toggleOpenFilter('Make')}
                            open={this.state.openFilter === 'Make'}
                            title="Vehicle Brand"
                            count={this.props.selectedMakes.length}
                        >
                            <FilterMakeSelector
                                makes={this.props.makes}
                                selectedMakes={this.props.selectedMakes}
                                onSelectMake={this.props.toggleMake}
                            />
                        </SidebarFilter>
                        <SidebarFilter
                            toggle={() => this.toggleOpenFilter('Vehicle Style')}
                            open={this.state.openFilter === 'Vehicle Style'}
                            title="Vehicle Style"
                            count={this.props.selectedStyles.length}
                        >
                            <FilterStyleSelector
                                styles={this.props.bodyStyles}
                                selectedStyles={this.props.selectedStyles}
                                onSelectStyle={this.props.toggleStyle}
                            />
                        </SidebarFilter>
                    </div>
                    <div className="sidebar-filters__section-header sidebar-filters__filter-title">
                        <p>Features & Options</p>
                    </div>
                    { this.renderSidebarFilters() }
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
        fuelTypes: state.fuelTypes,
        selectedFuelType: state.selectedFuelType,
        transmissionTypes: state.transmissionTypes,
        selectedTransmissionType: state.selectedTransmissionType,
        bodyStyles: state.bodyStyles,
        segments: state.segments,
        selectedSegment: state.selectedSegment,
        selectedStyles: state.selectedStyles,
        selectedMakes: state.selectedMakes,
        selectedModels: state.selectedModels,
        fallbackLogoImage: state.fallbackLogoImage,
        selectedFeatures: state.selectedFeatures,
        features: state.features,
        featureCategories: state.featureCategories,
        searchFeatures: state.searchFeatures,
    };
};

export default connect(mapStateToProps, Actions)(FilterPanel);
