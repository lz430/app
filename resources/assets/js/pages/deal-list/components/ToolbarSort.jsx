import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { toggleSearchSort } from 'pages/deal-list/actions';

class ToolbarSort extends React.Component {
    static propTypes = {
        onToggleSearchSort: PropTypes.func.isRequired,
        searchQuery: PropTypes.object.isRequired,
    };

    shouldComponentUpdate(nextProps) {
        return (
            this.props.searchQuery.sort !== nextProps.searchQuery.sort ||
            this.props.searchQuery.entity !== nextProps.searchQuery.entity
        );
    }

    change(sort) {
        this.props.onToggleSearchSort(sort);
    }

    render() {
        return (
            <div className="toolbar-sort">
                <select
                    onChange={e => this.change(e.target.value)}
                    value={this.props.searchQuery.sort}
                    name="sort"
                >
                    <option value="price">MSRP, low to high</option>
                    <option value="-price">MSRP, high to low</option>
                    <option value="payment">Payment, low to high</option>
                    <option value="-price">Payment, high to low</option>
                </select>
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
