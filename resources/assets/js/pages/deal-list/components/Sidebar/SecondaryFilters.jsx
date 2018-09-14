import React from 'react';
import PropTypes from 'prop-types';

import FilterFeature from './FilterFeature';

class SecondaryFilters extends React.PureComponent {
    static propTypes = {
        filters: PropTypes.object.isRequired,
        loadingSearchResults: PropTypes.bool.isRequired,
        selectedFiltersByCategory: PropTypes.object.isRequired,
        searchQuery: PropTypes.object.isRequired,
        onToggleSearchFilter: PropTypes.func.isRequired,
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

    /**
         Year
         Fuel Type
         Drive Train
         Comfort & Convenience
         Seating
         Seat Materials
         Seating Configuration
         Seating Capacity
         Vehicle Color
         Infotainment
         Safety & Driver Assist
         Pickup
     */
    render() {
        return (
            <div className="filter-group filter-group__secondary">
                <FilterFeature
                    title="Year"
                    key="filterYear"
                    open={true}
                    canToggle={false}
                    onToggleOpenFilter={this.toggleOpenFilter.bind(this)}
                    category="year"
                    items={this.props.filters['year']}
                    selectedItems={this.props.selectedFiltersByCategory['year']}
                    loadingSearchResults={this.props.loadingSearchResults}
                    onToggleSearchFilter={this.props.onToggleSearchFilter}
                />

                <FilterFeature
                    title="Vehicle Size"
                    key="filterVehicleSize"
                    open={true}
                    canToggle={false}
                    onToggleOpenFilter={this.toggleOpenFilter.bind(this)}
                    category="vehicle_size"
                    items={this.props.filters['vehicle_size']}
                    selectedItems={
                        this.props.selectedFiltersByCategory['vehicle_size']
                    }
                    loadingSearchResults={this.props.loadingSearchResults}
                    onToggleSearchFilter={this.props.onToggleSearchFilter}
                />

                <FilterFeature
                    title="Fuel Type"
                    key="filterFuelType"
                    open={true}
                    canToggle={false}
                    onToggleOpenFilter={this.toggleOpenFilter.bind(this)}
                    category="fuel_type"
                    items={this.props.filters['fuel_type']}
                    selectedItems={
                        this.props.selectedFiltersByCategory['fuel_type']
                    }
                    loadingSearchResults={this.props.loadingSearchResults}
                    onToggleSearchFilter={this.props.onToggleSearchFilter}
                />

                <FilterFeature
                    title="Drive Train"
                    key="filterDriveTrain"
                    open={true}
                    canToggle={false}
                    onToggleOpenFilter={this.toggleOpenFilter.bind(this)}
                    category="drive_train"
                    items={this.props.filters['drive_train']}
                    selectedItems={
                        this.props.selectedFiltersByCategory['drive_train']
                    }
                    loadingSearchResults={this.props.loadingSearchResults}
                    onToggleSearchFilter={this.props.onToggleSearchFilter}
                />

                <FilterFeature
                    title="Comfort & Convenience"
                    key="filterComfort"
                    open={true}
                    canToggle={false}
                    onToggleOpenFilter={this.toggleOpenFilter.bind(this)}
                    category="comfort_and_convenience"
                    items={this.props.filters['comfort_and_convenience']}
                    selectedItems={
                        this.props.selectedFiltersByCategory[
                            'comfort_and_convenience'
                        ]
                    }
                    loadingSearchResults={this.props.loadingSearchResults}
                    onToggleSearchFilter={this.props.onToggleSearchFilter}
                />

                <FilterFeature
                    title="Seating"
                    key="filterSeating"
                    open={true}
                    canToggle={false}
                    onToggleOpenFilter={this.toggleOpenFilter.bind(this)}
                    category="seating"
                    items={this.props.filters['seating']}
                    selectedItems={
                        this.props.selectedFiltersByCategory['seating']
                    }
                    loadingSearchResults={this.props.loadingSearchResults}
                    onToggleSearchFilter={this.props.onToggleSearchFilter}
                />

                <FilterFeature
                    title="Seating Capacity"
                    key="filterSeatingCapacity"
                    open={true}
                    canToggle={false}
                    onToggleOpenFilter={this.toggleOpenFilter.bind(this)}
                    category="seating_capacity"
                    items={this.props.filters['seating_capacity']}
                    selectedItems={
                        this.props.selectedFiltersByCategory['seating_capacity']
                    }
                    loadingSearchResults={this.props.loadingSearchResults}
                    onToggleSearchFilter={this.props.onToggleSearchFilter}
                />

                <FilterFeature
                    title="Seat Materials"
                    key="filterSeatMaterials"
                    open={true}
                    canToggle={false}
                    onToggleOpenFilter={this.toggleOpenFilter.bind(this)}
                    category="seat_materials"
                    items={this.props.filters['seat_materials']}
                    selectedItems={
                        this.props.selectedFiltersByCategory['seat_materials']
                    }
                    loadingSearchResults={this.props.loadingSearchResults}
                    onToggleSearchFilter={this.props.onToggleSearchFilter}
                />

                <FilterFeature
                    title="Infotainment"
                    key="filterInfotainment"
                    open={true}
                    canToggle={false}
                    onToggleOpenFilter={this.toggleOpenFilter.bind(this)}
                    category="infotainment"
                    items={this.props.filters['infotainment']}
                    selectedItems={
                        this.props.selectedFiltersByCategory['infotainment']
                    }
                    loadingSearchResults={this.props.loadingSearchResults}
                    onToggleSearchFilter={this.props.onToggleSearchFilter}
                />

                <FilterFeature
                    title="Safety & Driver Assist"
                    key="filterSafety"
                    open={true}
                    canToggle={false}
                    onToggleOpenFilter={this.toggleOpenFilter.bind(this)}
                    category="safety_and_driver_assist"
                    items={this.props.filters['safety_and_driver_assist']}
                    selectedItems={
                        this.props.selectedFiltersByCategory[
                            'safety_and_driver_assist'
                        ]
                    }
                    loadingSearchResults={this.props.loadingSearchResults}
                    onToggleSearchFilter={this.props.onToggleSearchFilter}
                />

                <FilterFeature
                    title="Vehicle Color"
                    key="filterVehicleColor"
                    open={true}
                    canToggle={false}
                    onToggleOpenFilter={this.toggleOpenFilter.bind(this)}
                    category="vehicle_color"
                    items={this.props.filters['vehicle_color']}
                    selectedItems={
                        this.props.selectedFiltersByCategory['vehicle_color']
                    }
                    loadingSearchResults={this.props.loadingSearchResults}
                    onToggleSearchFilter={this.props.onToggleSearchFilter}
                />

                <FilterFeature
                    title="Pickup"
                    key="filterPickup"
                    open={true}
                    canToggle={false}
                    onToggleOpenFilter={this.toggleOpenFilter.bind(this)}
                    category="pickup"
                    items={this.props.filters['pickup']}
                    selectedItems={
                        this.props.selectedFiltersByCategory['pickup']
                    }
                    loadingSearchResults={this.props.loadingSearchResults}
                    onToggleSearchFilter={this.props.onToggleSearchFilter}
                />
            </div>
        );
    }
}

export default SecondaryFilters;
