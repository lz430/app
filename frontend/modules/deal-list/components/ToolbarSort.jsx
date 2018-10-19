import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import classNames from 'classnames';
import { find } from 'ramda';

import { toggleSearchSort } from '../../deal-list/actions';
import {
    Dropdown,
    DropdownToggle,
    DropdownMenu,
    DropdownItem,
} from 'reactstrap';

class ToolbarSort extends React.Component {
    static propTypes = {
        onToggleSearchSort: PropTypes.func.isRequired,
        searchQuery: PropTypes.object.isRequired,
    };

    state = {
        dropdownOpen: false,
    };

    sorts = [
        {
            key: 'title',
            label: 'Name: A > Z',
        },
        {
            key: '-title',
            label: 'Name: Z > A',
        },
        {
            key: 'price',
            label: 'MSRP: Low > High',
        },
        {
            key: '-price',
            label: 'MSRP: High > Low',
        },
        {
            key: 'payment',
            label: 'Payment: Low > High',
        },
        {
            key: '-payment',
            label: 'Payment: High > Low',
        },
    ];

    change(sort) {
        this.props.onToggleSearchSort(sort);
    }

    toggle() {
        this.setState(prevState => ({
            dropdownOpen: !prevState.dropdownOpen,
        }));
    }

    findActive() {
        const current = this.props.searchQuery.sort;
        return find(function(item) {
            return current === item.key;
        })(this.sorts);
    }

    renderSortButton(item) {
        return (
            <DropdownItem
                key={item.key}
                onClick={() => this.props.onToggleSearchSort(item.key)}
                className={classNames('text-sm', {
                    active: this.props.searchQuery.sort === item.key,
                })}
            >
                {item.label}
            </DropdownItem>
        );
    }

    render() {
        const active = this.findActive();

        return (
            <div className="toolbar-sort">
                <Dropdown
                    size="sm"
                    isOpen={this.state.dropdownOpen}
                    toggle={this.toggle.bind(this)}
                >
                    <DropdownToggle caret color="outline-primary">
                        {active && active.label}
                    </DropdownToggle>
                    <DropdownMenu>
                        {this.sorts.map(item => {
                            return this.renderSortButton(item);
                        })}
                    </DropdownMenu>
                </Dropdown>
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        searchQuery: state.pages.dealList.searchQuery,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        onToggleSearchSort: sort => {
            return dispatch(toggleSearchSort(sort));
        },
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ToolbarSort);
