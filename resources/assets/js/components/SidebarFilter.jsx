import React from 'react';
import SVGInline from 'react-svg-inline';
import zondicons from 'zondicons';
import PropTypes from 'prop-types';

class SidebarFilter extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            open: false,
        };

        this.toggle = this.toggle.bind(this);
    }

    toggle() {
        this.setState({
            open: !this.state.open,
        });
    }

    render() {
        return (
            <div className="sidebar-filters__filter">
                <div
                    className="sidebar-filters__filter-title"
                    onClick={this.toggle}
                >
                    <SVGInline
                        className="sidebar-filters__icon"
                        svg={
                            this.state.open
                                ? zondicons['cheveron-up']
                                : zondicons['cheveron-down']
                        }
                    />
                    {' '}
                    {this.props.title}
                    {this.props.count > 0
                        ? <div className="sidebar-filters__count">
                              {this.props.count}
                          </div>
                        : ''}
                </div>

                {this.state.open
                    ? <div className="sidebar-filters__filter-body">
                          {this.props.children()}
                      </div>
                    : ''}
            </div>
        );
    }
}

SidebarFilter.propTypes = {
    title: PropTypes.string.isRequired,
    children: PropTypes.func.isRequired,
    count: PropTypes.number,
};

export default SidebarFilter;
