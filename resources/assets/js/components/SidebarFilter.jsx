import React from 'react';
import SVGInline from 'react-svg-inline';
import zondicons from 'zondicons';
import * as Actions from 'actions/index';
import { connect } from 'react-redux';

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
                    {this.props.title}
                </div>

                {this.state.open
                    ? <div className="sidebar-filters__filter-body">
                          body
                      </div>
                    : ''}
            </div>
        );
    }
}

export default connect(null, Actions)(SidebarFilter);
