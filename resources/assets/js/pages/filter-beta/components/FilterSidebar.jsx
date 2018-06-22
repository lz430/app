import React from 'react';

import {
    MultiList,
    CategorySearch,
    DynamicRangeSlider,
} from '@appbaseio/reactivesearch';

/**
 *
 */
class FilterSidebar extends React.Component {
    render() {
        let reactOn = {
            and: [
                'SearchFilter',
                'MakeFilter',
                'ModelFilter',
                'StyleFilter',
                'ColorFilter',
                'ComfortFilter',
                'DriveTrainFilter',
                'FuelTypeFilter',
                'SeatingFilter',
                'SeatingConfigFilter',
                'MsrpFilter',
                'TransmissionFilter',
                'InfotainmentFilter',
                'SafetyFilter',
                'PickupFilter',
            ],
        };

        return (
            <div className="browser-page__sidebar">
                {/*
                Geo Info
                */}

                {/*
                Search
                */}
                <CategorySearch
                    className="browser-page__sidebar__search"
                    filterLabel="Search"
                    componentId="SearchFilter"
                    dataField={['make', 'model', 'year', 'trim']}
                    react={reactOn}
                    categoryField="group_topics"
                />

                {/*
                Primary Filters
                */}
                <div className="sidebar-filters__broad sidebar-filters__broad--broad">
                    <div className="sidebar-filters__instructive-heading">
                        Refine this search
                    </div>
                    <MultiList
                        className="browser-page__sidebar__filter"
                        componentId="StyleFilter"
                        dataField="style.keyword"
                        showSearch={false}
                        size={100}
                        react={reactOn}
                    />

                    <MultiList
                        className="browser-page__sidebar__filter"
                        componentId="MakeFilter"
                        dataField="make.keyword"
                        showSearch={false}
                        queryFormat="or"
                        size={100}
                        react={reactOn}
                    />

                    <MultiList
                        className="browser-page__sidebar__filter"
                        componentId="ModelFilter"
                        dataField="model.keyword"
                        showSearch={false}
                        size={100}
                        react={reactOn}
                    />
                </div>

                {/*
                Secondary Filters
                */}
                <div className="sidebar-filters__narrow sidebar-filters__narrow--">
                    <div className="sidebar-filters__instructive-heading">
                        Features & Options
                    </div>
                    {/* Fuel Type */}
                    <MultiList
                        className="browser-page__sidebar__filter"
                        componentId="FuelTypeFilter"
                        dataField="fuel_type.keyword"
                        showSearch={false}
                        size={100}
                        react={reactOn}
                    />

                    {/* Drive Train */}
                    <MultiList
                        className="browser-page__sidebar__filter"
                        componentId="DriveTrainFilter"
                        dataField="drive_train.keyword"
                        showSearch={false}
                        size={100}
                        react={reactOn}
                    />

                    {/* Comfort & Convenience */}
                    <MultiList
                        className="browser-page__sidebar__filter"
                        componentId="ComfortFilter"
                        dataField="comfort_and_convenience.keyword"
                        showSearch={false}
                        size={100}
                        react={reactOn}
                    />

                    {/* Transmission */}
                    <MultiList
                        className="browser-page__sidebar__filter"
                        componentId="TransmissionFilter"
                        dataField="transmission.keyword"
                        showSearch={false}
                        size={100}
                        react={reactOn}
                    />

                    {/* Seating */}
                    <MultiList
                        className="browser-page__sidebar__filter"
                        componentId="SeatingConfigFilter"
                        dataField="seating_configuration.keyword"
                        showSearch={false}
                        size={100}
                        react={reactOn}
                    />

                    {/* Seat Materials */}
                    <MultiList
                        className="browser-page__sidebar__filter"
                        componentId="SeatingFilter"
                        dataField="seat_materials.keyword"
                        showSearch={false}
                        size={100}
                        react={reactOn}
                    />

                    {/* Infotainment */}
                    <MultiList
                        className="browser-page__sidebar__filter"
                        componentId="InfotainmentFilter"
                        dataField="infotainment.keyword"
                        showSearch={false}
                        size={100}
                        react={reactOn}
                    />

                    {/* Safety & Driver Assist */}
                    <MultiList
                        className="browser-page__sidebar__filter"
                        componentId="SafetyFilter"
                        dataField="safety_and_driver_assist.keyword"
                        showSearch={false}
                        size={100}
                        react={reactOn}
                    />

                    {/* Pickup */}
                    <MultiList
                        className="browser-page__sidebar__filter"
                        componentId="PickupFilter"
                        dataField="pickup.keyword"
                        showSearch={false}
                        size={100}
                        react={reactOn}
                    />
                </div>
            </div>
        );
    }
}

export default FilterSidebar;
