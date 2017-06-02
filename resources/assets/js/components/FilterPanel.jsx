import React from 'react';
import SidebarFilter from './SidebarFilter';
import ZipcodeFinder from './ZipcodeFinder'

class FilterPanel extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div>
                <ZipcodeFinder onUpdate={console.log}/>

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

export default FilterPanel;
