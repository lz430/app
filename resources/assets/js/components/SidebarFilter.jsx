import React from 'react';

class SidebarFilter extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="sidebar-filters__filter">
                <img className="sidebar-filters__icon" src="images/zondicons/cheveron-down.svg"/> {this.props.title}
            </div>
        );
    }
}

export default SidebarFilter;
