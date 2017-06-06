import React from 'react';
import SidebarFilter from 'components/SidebarFilter';
import ZipcodeFinder from 'components/ZipcodeFinder';
import FilterStyleSelector from 'components/FilterStyleSelector';
import { connect } from 'react-redux';
import * as Actions from 'actions/index';

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
                        {() => 'body'}
                    </SidebarFilter>
                    <SidebarFilter title="Fuel">
                        {() => 'body'}
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
        bodyStyles: state.bodyStyles,
        selectedStyles: state.selectedStyles,
        fallbackLogoImage: state.fallbackLogoImage,
    };
};

export default connect(mapStateToProps, Actions)(FilterPanel);
