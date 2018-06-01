import React from 'react';

import { MultiList,
    CategorySearch,
    DynamicRangeSlider } from '@appbaseio/reactivesearch';


/**
 *
 */
class FilterSidebar extends React.Component {

    render() {

        let reactOn = {
            and: ["SearchFilter", "MakeFilter", "ModelFilter", "StyleFilter", "ColorFilter", "ComfortFilter", "MsrpFilter"]
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
                    dataField={["make", "model"]}
                    react={reactOn}
                    categoryField="group_topics"
                />

                {/*
                Primary Filters
                */}
                <div className="sidebar-filters__broad sidebar-filters__broad--broad">
                    <div className="sidebar-filters__instructive-heading">Refine this search</div>

                    <MultiList
                        className="browser-page__sidebar__filter"
                        componentId="MakeFilter"
                        dataField="make.keyword"
                        showSearch={false}
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

                    <MultiList
                        className="browser-page__sidebar__filter"
                        componentId="StyleFilter"
                        dataField="style.keyword"
                        showSearch={false}
                        size={100}
                        react={reactOn}

                    />
                </div>

                {/*
                Secondary Filters
                */}
                <div className="sidebar-filters__narrow sidebar-filters__narrow--">
                    <div className="sidebar-filters__instructive-heading">Features & Options</div>
                    <MultiList
                        className="browser-page__sidebar__filter"
                        componentId="ColorFilter"
                        dataField="color.keyword"
                        showSearch={false}
                        size={100}
                        react={reactOn}

                    />
                    <MultiList
                        className="browser-page__sidebar__filter"
                        componentId="ComfortFilter"
                        dataField="comfort_and_convenience.keyword"
                        showSearch={false}
                        size={100}
                        react={reactOn}
                    />

                    <DynamicRangeSlider
                        componentId="MsrpFilter"
                        dataField="employee_price"
                    />

                </div>
            </div>
        );
    }

}

export default FilterSidebar;
