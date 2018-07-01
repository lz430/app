import React from 'react';
import PropTypes from 'prop-types';

import FilterFeature from './FilterFeature';

class SecondaryFilters extends React.PureComponent {
    static propTypes = {
        filters: PropTypes.object.isRequired,
        searchQuery: PropTypes.object.isRequired,
        onToggleFeature: PropTypes.func.isRequired,
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
         Fuel Type
         Drive Train
         Comfort & Convenience
         Seating
         Seat Materials
         Seating Configuration
         Infotainment
         Safety & Driver Assist
         Pickup
     */
    render() {
        return (
            <div>
                <FilterFeature
                    title="Fuel Type"
                    key="filterFuelType"
                    open={true}
                    canToggle={false}
                    onToggleOpenFilter={this.toggleOpenFilter.bind(this)}
                    count={0}
                    selectedFeatures={this.props.searchQuery.features}
                    items={this.props.filters.fuel_type}
                    onToggleFeature={this.props.onToggleFeature}
                />

                <FilterFeature
                    title="Drive Train"
                    key="filterDriveTrain"
                    open={true}
                    canToggle={false}
                    onToggleOpenFilter={this.toggleOpenFilter.bind(this)}
                    count={0}
                    selectedFeatures={this.props.searchQuery.features}
                    items={this.props.filters.drive_train}
                    onToggleFeature={this.props.onToggleFeature}
                />

                <FilterFeature
                    title="Comfort & Convenience"
                    key="filterComfort"
                    open={true}
                    canToggle={false}
                    onToggleOpenFilter={this.toggleOpenFilter.bind(this)}
                    count={0}
                    selectedFeatures={this.props.searchQuery.features}
                    items={this.props.filters.comfort_and_convenience}
                    onToggleFeature={this.props.onToggleFeature}
                />

                <FilterFeature
                    title="Seating"
                    key="filterSeating"
                    open={true}
                    canToggle={false}
                    onToggleOpenFilter={this.toggleOpenFilter.bind(this)}
                    count={0}
                    selectedFeatures={this.props.searchQuery.features}
                    items={this.props.filters.seating}
                    onToggleFeature={this.props.onToggleFeature}
                />

                <FilterFeature
                    title="Seat Materials"
                    key="filterSeatMaterials"
                    open={true}
                    canToggle={false}
                    onToggleOpenFilter={this.toggleOpenFilter.bind(this)}
                    count={0}
                    selectedFeatures={this.props.searchQuery.features}
                    items={this.props.filters.seat_materials}
                    onToggleFeature={this.props.onToggleFeature}
                />

                <FilterFeature
                    title="Infotainment"
                    key="filterInfotainment"
                    open={true}
                    canToggle={false}
                    onToggleOpenFilter={this.toggleOpenFilter.bind(this)}
                    count={0}
                    selectedFeatures={this.props.searchQuery.features}
                    items={this.props.filters.infotainment}
                    onToggleFeature={this.props.onToggleFeature}
                />

                <FilterFeature
                    title="Pickup"
                    key="filterPickup"
                    open={true}
                    canToggle={false}
                    onToggleOpenFilter={this.toggleOpenFilter.bind(this)}
                    count={0}
                    selectedFeatures={this.props.searchQuery.features}
                    items={this.props.filters.pickup}
                    onToggleFeature={this.props.onToggleFeature}
                />
            </div>
        );
    }
}

export default SecondaryFilters;
