import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import Tuning from 'icons/zondicons/Tuning';
import { clearModelYear, toggleSmallFiltersShown } from '../actions';
import { getSearchQuery } from '../selectors';

/**
 *
 */
class ToolbarMobileBottom extends React.Component {
    static propTypes = {
        searchQuery: PropTypes.object.isRequired,
        onToggleSmallFiltersShown: PropTypes.func.isRequired,
        onClearModelYear: PropTypes.func.isRequired,
    };

    renderBackButton() {
        return (
            <span onClick={this.props.onClearModelYear}>
                <Tuning
                    height="16px"
                    height="16px"
                    className="sortbar__filter-toggle-icon"
                />
            </span>
        );
    }

    render() {
        return (
            <div className="toolbar-mobile-bottom">
                <span onClick={this.props.onToggleSmallFiltersShown}>
                    <Tuning
                        height="16px"
                        height="16px"
                        className="sortbar__filter-toggle-icon"
                    />
                    Filter
                </span>
                <span onClick={this.props.onToggleSmallFiltersShown}>
                    <Tuning
                        height="16px"
                        height="16px"
                        className="sortbar__filter-toggle-icon"
                    />
                    Sort
                </span>
                <span onClick={this.props.onToggleSmallFiltersShown}>
                    <Tuning
                        height="16px"
                        height="16px"
                        className="sortbar__filter-toggle-icon"
                    />
                    Payment
                </span>
                {this.props.searchQuery.entity === 'deal' &&
                    this.renderBackButton()}
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        searchQuery: getSearchQuery(state),
    };
};

const mapDispatchToProps = dispatch => {
    return {
        onToggleSmallFiltersShown: () => {
            return dispatch(toggleSmallFiltersShown());
        },
        onClearModelYear: () => {
            return dispatch(clearModelYear());
        },
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ToolbarMobileBottom);
