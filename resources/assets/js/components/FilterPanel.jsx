import React from 'react';
import SidebarFilter from 'components/SidebarFilter';
import ZipcodeFinder from 'components/ZipcodeFinder';
import FilterStyleSelector from 'components/FilterStyleSelector';
import FilterMakeSelector from 'components/FilterMakeSelector';
import FilterFuelTypeSelector from 'components/FilterFuelTypeSelector';
import FilterFeatureSelector from 'components/FilterFeatureSelector';
import FilterTransmissionTypeSelector from 'components/FilterTransmissionTypeSelector';
import { connect } from 'react-redux';
import * as Actions from 'actions/index';
import R from 'ramda';

class FilterPanel extends React.PureComponent {
    constructor(props) {
        super(props);

        this.getFeaturesByGroup = this.getFeaturesByGroup.bind(this);
    }

    getFeaturesByGroup(group) {
        return R.filter(feature => {
            return R.path(['attributes', 'group'], feature) === group;
        }, this.props.features);
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
                    <div className="sidebar-filters__header">
                        Filter Results
                    </div>
                    <SidebarFilter
                        title="Vehicle Style"
                        count={this.props.selectedStyles.length}
                    >
                        {() => (
                            <FilterStyleSelector
                                styles={this.props.bodyStyles}
                                selectedStyles={this.props.selectedStyles}
                                onSelectStyle={this.props.toggleStyle}
                            />
                        )}
                    </SidebarFilter>
                    <SidebarFilter
                        title="Brand"
                        count={this.props.selectedMakes.length}
                    >
                        {() => (
                            <FilterMakeSelector
                                makes={this.props.makes}
                                selectedMakes={this.props.selectedMakes}
                                onSelectMake={this.props.toggleMake}
                            />
                        )}
                    </SidebarFilter>
                    <SidebarFilter
                        title="Fuel"
                        count={this.props.selectedFuelType ? 1 : 0}
                    >
                        {() => (
                            <FilterFuelTypeSelector
                                fuelTypes={this.props.fuelTypes}
                                selectedFuelType={this.props.selectedFuelType}
                                onChooseFuelType={this.props.chooseFuelType}
                            />
                        )}
                    </SidebarFilter>
                    <SidebarFilter
                        title="Transmission"
                        count={this.props.selectedTransmissionType ? 1 : 0}
                    >
                        {() => (
                            <FilterTransmissionTypeSelector
                                transmissionTypes={this.props.transmissionTypes}
                                selectedTransmissionType={
                                    this.props.selectedTransmissionType
                                }
                                onSelectTransmissionType={
                                    this.props.chooseTransmissionType
                                }
                            />
                        )}
                    </SidebarFilter>
                    <SidebarFilter
                        title="Seating"
                        count={this.getCountOfSelectedFeatureByGroup('seating')}
                    >
                        {() => (
                            <FilterFeatureSelector
                                selectedFeatures={this.props.selectedFeatures}
                                features={this.getFeaturesByGroup('seating')}
                                onSelectFeature={this.props.toggleFeature}
                            />
                        )}
                    </SidebarFilter>
                    <SidebarFilter
                        title="Safety"
                        count={this.getCountOfSelectedFeatureByGroup('safety')}
                    >
                        {() => (
                            <FilterFeatureSelector
                                selectedFeatures={this.props.selectedFeatures}
                                features={this.getFeaturesByGroup('safety')}
                                onSelectFeature={this.props.toggleFeature}
                            />
                        )}
                    </SidebarFilter>
                    <SidebarFilter
                        title="Technology"
                        count={this.getCountOfSelectedFeatureByGroup(
                            'technology'
                        )}
                    >
                        {() => (
                            <FilterFeatureSelector
                                selectedFeatures={this.props.selectedFeatures}
                                features={this.getFeaturesByGroup('technology')}
                                onSelectFeature={this.props.toggleFeature}
                            />
                        )}
                    </SidebarFilter>
                    <SidebarFilter
                        title="Convenience"
                        count={this.getCountOfSelectedFeatureByGroup(
                            'comfort and convenience'
                        )}
                    >
                        {() => (
                            <FilterFeatureSelector
                                selectedFeatures={this.props.selectedFeatures}
                                features={this.getFeaturesByGroup(
                                    'comfort and convenience'
                                )}
                                onSelectFeature={this.props.toggleFeature}
                            />
                        )}
                    </SidebarFilter>
                    {R.contains('Pickup', this.props.selectedStyles) ? (
                        <SidebarFilter
                            title="Truck"
                            count={this.getCountOfSelectedFeatureByGroup(
                                'truck'
                            )}
                        >
                            {() => (
                                <FilterFeatureSelector
                                    selectedFeatures={
                                        this.props.selectedFeatures
                                    }
                                    features={this.getFeaturesByGroup('truck')}
                                    onSelectFeature={this.props.toggleFeature}
                                />
                            )}
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
        fuelTypes: state.fuelTypes,
        selectedFuelType: state.selectedFuelType,
        transmissionTypes: state.transmissionTypes,
        selectedTransmissionType: state.selectedTransmissionType,
        bodyStyles: state.bodyStyles,
        selectedStyles: state.selectedStyles,
        selectedMakes: state.selectedMakes,
        fallbackLogoImage: state.fallbackLogoImage,
        selectedFeatures: state.selectedFeatures,
        features: state.features,
    };
};

export default connect(mapStateToProps, Actions)(FilterPanel);
