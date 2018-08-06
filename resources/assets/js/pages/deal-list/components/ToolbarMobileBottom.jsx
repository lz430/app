import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import Tuning from 'icons/zondicons/Tuning';
import { toggleSmallFiltersShown } from '../actions';

/**
 *
 */
class ToolbarMobileBottom extends React.Component {
    static propTypes = {
        onToggleSmallFiltersShown: PropTypes.func.isRequired,
    };

    render() {
        return (
            <div className="toolbar-mobile-bottom">
                <span onClick={this.props.onToggleSmallFiltersShown}>
                    <Tuning
                        height="20px"
                        width="20px"
                        className="sortbar__filter-toggle-icon"
                    />
                    Filter Results
                </span>
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {};
};

const mapDispatchToProps = dispatch => {
    return {
        onToggleSmallFiltersShown: () => {
            return dispatch(toggleSmallFiltersShown());
        },
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ToolbarMobileBottom);
