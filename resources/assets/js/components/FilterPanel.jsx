import React from 'react';
import SidebarFilter from 'components/SidebarFilter';
import ZipcodeFinder from 'components/ZipcodeFinder';
import FilterStyleSelector from 'components/FilterStyleSelector';
import FilterMakeSelector from 'components/FilterMakeSelector';
import FilterFuelTypeSelector from 'components/FilterFuelTypeSelector';
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
                                selectedFuelTypes={this.props.selectedFuelTypes}
                                onSelectFuelType={this.props.toggleFuelType}
                            />
                        )}
                    </SidebarFilter>
                    <SidebarFilter title="Transmission">
                        {() => 'body'}
                    </SidebarFilter>
                    <SidebarFilter title="Seating">
                        {() => 'body'}
                    </SidebarFilter>
                    <SidebarFilter title="Convenience">
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
        selectedFuelTypes: state.selectedFuelTypes,
        bodyStyles: state.bodyStyles,
        selectedStyles: state.selectedStyles,
        selectedMakes: state.selectedMakes,
        fallbackLogoImage: state.fallbackLogoImage,
    };
};

export default connect(mapStateToProps, Actions)(FilterPanel);
