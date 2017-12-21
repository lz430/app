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

    render() {
        return (
            <div>
                <ZipcodeFinder />

                <div className="sidebar-filters">
                    <SidebarFilter
                        toggle={() => this.toggleOpenFilter('Make')}
                        open={this.state.openFilter === 'Make'}
                        title="Vehicle Make"
                        count={this.props.selectedMakes.length}
                    >
                        <FilterMakeSelector
                            makes={this.props.makes}
                            selectedMakes={this.props.selectedMakes}
                            onSelectMake={this.props.toggleMake}
                        />
                    </SidebarFilter>
                    <SidebarFilter
                        toggle={() => this.toggleOpenFilter('Vehicle Model')}
                        open={this.state.openFilter === 'Model'}
                        title="Vehicle Model"
                    >
                        <div>
                            <p>Placeholder Text</p>
                        </div>
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
                    <SidebarFilter
                        toggle={() => this.toggleOpenFilter('Vehicle Segment')}
                        open={this.state.openFilter === 'Vehicle Segment'}
                        title="Vehicle Class"
                        count={this.props.selectedSegment ? 1 : 0}
                    >
                        <FilterSegmentSelector
                            segments={this.props.segments}
                            selectedSegment={this.props.selectedSegment}
                            onSelectSegment={this.props.chooseSegment}
                        />
                    </SidebarFilter>
                    <div className="sidebar-filters__section-header sidebar-filters__filter-title">
                        <p>Features & Options</p>
                    </div>
                    <SidebarFilter
                        toggle={() => this.toggleOpenFilter('Fuel')}
                        open={this.state.openFilter === 'Fuel'}
                        title="Fuel Type"
                        count={this.props.selectedFuelType ? 1 : 0}
                    >
                        <FilterFuelTypeSelector
                            fuelTypes={this.props.fuelTypes}
                            selectedFuelType={this.props.selectedFuelType}
                            onChooseFuelType={this.props.chooseFuelType}
                        />
                    </SidebarFilter>
                    <SidebarFilter
                        toggle={() => this.toggleOpenFilter('Transmission')}
                        open={this.state.openFilter === 'Transmission'}
                        title="Transmission"
                        count={this.props.selectedTransmissionType ? 1 : 0}
                    >
                        <FilterTransmissionTypeSelector
                            transmissionTypes={this.props.transmissionTypes}
                            selectedTransmissionType={
                                this.props.selectedTransmissionType
                            }
                            onSelectTransmissionType={
                                this.props.chooseTransmissionType
                            }
                        />
                    </SidebarFilter>
                    <SidebarFilter
                        toggle={() => this.toggleOpenFilter('Drive Train')}
                        open={this.state.openFilter === 'Drive Train'}
                        title="Drive Train"
                    >
                        <div>
                            <p>Placeholder Text</p>
                        </div>
                    </SidebarFilter>
                    <SidebarFilter
                        toggle={() => this.toggleOpenFilter('Convenience')}
                        open={this.state.openFilter === 'Convenience'}
                        title="Comfort & Convenience"
                        count={this.getCountOfSelectedFeatureByGroup(
                            'comfort and convenience'
                        )}
                    >
                        <FilterFeatureSelector
                            selectedFeatures={this.props.selectedFeatures}
                            features={this.getFeaturesByGroup(
                                'comfort and convenience'
                            )}
                            onSelectFeature={this.props.toggleFeature}
                        />
                    </SidebarFilter>
                    <SidebarFilter
                        toggle={() => this.toggleOpenFilter('Seating')}
                        open={this.state.openFilter === 'Seating'}
                        title="Seating"
                        count={this.getCountOfSelectedFeatureByGroup('seating')}
                    >
                        <FilterFeatureSelector
                            selectedFeatures={this.props.selectedFeatures}
                            features={this.getFeaturesByGroup('seating')}
                            onSelectFeature={this.props.toggleFeature}
                        />
                    </SidebarFilter>
                    <SidebarFilter
                        toggle={() => this.toggleOpenFilter('Technology')}
                        open={this.state.openFilter === 'Technology'}
                        title="Infotainment"
                        count={this.getCountOfSelectedFeatureByGroup(
                            'technology'
                        )}
                    >
                        <FilterFeatureSelector
                            selectedFeatures={this.props.selectedFeatures}
                            features={this.getFeaturesByGroup('technology')}
                            onSelectFeature={this.props.toggleFeature}
                        />
                    </SidebarFilter>
                    <SidebarFilter
                        toggle={() => this.toggleOpenFilter('Interior')}
                        open={this.state.openFilter === 'Interior'}
                        title="Interior"
                        count={this.getCountOfSelectedFeatureByGroup(
                            'interior'
                        )}
                    >
                        <div>
                            <p>Placeholder Text</p>
                        </div>
                    </SidebarFilter>
                    <SidebarFilter
                        toggle={() => this.toggleOpenFilter('Safety')}
                        open={this.state.openFilter === 'Safety'}
                        title="Safety & Driver Assist"
                        count={this.getCountOfSelectedFeatureByGroup('safety')}
                    >
                        <FilterFeatureSelector
                            selectedFeatures={this.props.selectedFeatures}
                            features={this.getFeaturesByGroup('safety')}
                            onSelectFeature={this.props.toggleFeature}
                        />
                    </SidebarFilter>
                    {R.contains('Pickup', this.props.selectedStyles) ? (
                        <SidebarFilter
                            toggle={() => this.toggleOpenFilter('Truck')}
                            open={this.state.openFilter === 'Truck'}
                            title="Truck"
                            count={this.getCountOfSelectedFeatureByGroup(
                                'truck'
                            )}
                        >
                            <FilterFeatureSelector
                                selectedFeatures={this.props.selectedFeatures}
                                features={this.getFeaturesByGroup('truck')}
                                onSelectFeature={this.props.toggleFeature}
                            />
                        </SidebarFilter>
                    ) : (
                        ''
                    )}
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
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
    };
};

export default connect(mapStateToProps, Actions)(FilterPanel);
