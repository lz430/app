import React from 'react';
import SVGInline from "react-svg-inline"
import zondicons from '../zondicons';

class SidebarFilter extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="sidebar-filters__filter">
                <SVGInline className="sidebar-filters__icon" svg={ zondicons['cheveron-down'] } />
                {this.props.title}
            </div>
        );
    }
}

export default SidebarFilter;
