import React from 'react';
import SidebarFilter from 'components/SidebarFilter';
import ZipcodeFinder from 'components/ZipcodeFinder';
import FilterStyleSelector from 'components/FilterStyleSelector';
import FilterMakeSelector from 'components/FilterMakeSelector';
import FilterFuelTypeSelector from 'components/FilterFuelTypeSelector';
import FilterFeatureSelector from 'components/FilterFeatureSelector';
import FilterTransmissionTypeSelector
    from 'components/FilterTransmissionTypeSelector';
import { connect } from 'react-redux';
import * as Actions from 'actions/index';
import R from 'ramda';

class FilterPanel extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div>
                <ZipcodeFinder onUpdate={console.log} />

                <div className="sidebar-filters">
                    <div className="sidebar-filters__header">
                        Filter Results
                    </div>
                    <SidebarFilter title="Vehicle Style">
                        {() => (
                            <FilterStyleSelector
                                styles={this.props.bodyStyles}
                                selectedStyles={this.props.selectedStyles}
                                onSelectStyle={this.props.toggleStyle}
                            />
                        )}
                    </SidebarFilter>
                    <SidebarFilter title="Brand">
                        {() => (
                            <FilterMakeSelector
                                makes={this.props.makes}
                                selectedMakes={this.props.selectedMakes}
                                onSelectMake={this.props.toggleMake}
                            />
                        )}
                    </SidebarFilter>
                    <SidebarFilter title="Fuel">
                        {() => (
                            <FilterFuelTypeSelector
                                fuelTypes={this.props.fuelTypes}
                                selectedFuelType={this.props.selectedFuelType}
                                onChooseFuelType={this.props.chooseFuelType}
                            />
                        )}
                    </SidebarFilter>
                    <SidebarFilter title="Transmission">
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
                    <SidebarFilter title="Seating">
                        {() => (
                            <FilterFeatureSelector
                                selectedFeatures={this.props.selectedFeatures}
                                features={R.filter(feature => {
                                    return (
                                        R.path(
                                            ['attributes', 'group'],
                                            feature
                                        ) === 'seating'
                                    );
                                }, this.props.features)}
                                onSelectFeature={this.props.toggleFeature}
                            />
                        )}
                    </SidebarFilter>
                    <SidebarFilter title="Safety">
                        {() => 'body'}
                    </SidebarFilter>
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
