import React from 'react';
import SidebarFilter from "./SidebarFilter";

class FilterResults extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div>
                <div className="zipcode-finder">
                    <div className="zipcode-finder__info">
                        <div>Zip Code</div>
                        <div className="zipcode-finder__code">90040</div>
                    </div>
                    <div className="zipcode-finder__buttons">
                        <button className="zipcode-finder__button zipcode-finder__button--blue zipcode-finder__button--small">
                            Update
                        </button>
                    </div>
                </div>
                <div className="sidebar-filters">
                    <div className="sidebar-filters__header">
                        Filter Results
                    </div>
                    <SidebarFilter title="Vehicle Style"/>
                    <SidebarFilter title="Brand"/>
                    <SidebarFilter title="Fuel"/>
                    <SidebarFilter title="Transmission"/>
                    <SidebarFilter title="Seating"/>
                    <SidebarFilter title="Convenience"/>
                </div>
            </div>
        );
    }
}

export default FilterResults;
