import React from 'react';
import SVGInline from 'react-svg-inline';
import zondicons from 'zondicons';
import PropTypes from 'prop-types';

class SidebarFilter extends React.PureComponent {
    render() {
        return (
            <div className="sidebar-filters__filter">
                <div
                    className={`sidebar-filters__filter-title ${this.props.open
                        ? 'sidebar-filters__filter-title--open'
                        : ''}`}
                    onClick={this.props.toggle}
                >
                    {this.props.title}
                    <SVGInline
                        className="sidebar-filters__icon"
                        svg={
                            this.props.open ? (
                                zondicons['cheveron-up']
                            ) : (
                                zondicons['cheveron-down']
                            )
                        }
                    />
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

SidebarFilter.propTypes = {
    open: PropTypes.bool.isRequired,
    toggle: PropTypes.func.isRequired,
    title: PropTypes.string.isRequired,
    children: PropTypes.object.isRequired,
    count: PropTypes.number,
};

export default SidebarFilter;
