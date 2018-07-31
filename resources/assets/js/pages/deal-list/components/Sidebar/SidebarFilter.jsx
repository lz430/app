import React from 'react';
import PropTypes from 'prop-types';

import CheveronUp from 'icons/zondicons/CheveronUp';
import CheveronDown from 'icons/zondicons/CheveronDown';

class SidebarFilter extends React.PureComponent {
    static propTypes = {
        open: PropTypes.bool.isRequired,
        toggle: PropTypes.func.isRequired,
        title: PropTypes.string.isRequired,
        children: PropTypes.object.isRequired,
        selectedItems: PropTypes.array,
        canToggle: PropTypes.bool,
    };

    static defaultProps = {
        canToggle: true,
    };
    renderIcon() {
        if (this.props.open) {
            return <CheveronUp className="sidebar-filters__icon" />;
        }

        return <CheveronDown className="sidebar-filters__icon" />;
    }
    render() {
        return (
            <div className="sidebar-filters__filter">
                <div
                    className={`sidebar-filters__filter-title ${
                        this.props.open
                            ? 'sidebar-filters__filter-title--open'
                            : ''
                    }`}
                    onClick={
                        this.props.canToggle ? this.props.toggle : () => {}
                    }
                >
                    {this.props.canToggle && this.renderIcon()}
                    {this.props.title}
                    <span className="sidebar-filters__count">
                        {this.props.selectedItems
                            ? this.props.selectedItems.length
                            : 0}
                    </span>
                </div>

                {this.props.open ? (
                    <div className="sidebar-filters__filter-body">
                        {this.props.children}
                    </div>
                ) : (
                    ''
                )}
            </div>
        );
    }
}

export default SidebarFilter;
