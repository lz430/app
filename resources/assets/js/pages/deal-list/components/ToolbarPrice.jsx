import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import Sortbar from './Sortbar';
import { requestSearch } from 'pages/deal-list/actions';
import util from 'src/util';

/**
 *
 */
class ToolbarPrice extends React.Component {
    static propTypes = {
        onRequestSearch: PropTypes.func.isRequired,
        searchQuery: PropTypes.object.isRequired,
    };

    render() {
        if (util.windowIsLargerThanSmall(this.props.window.width)) {
            return false;
        }
        return (
            <div className="filter-page__top-row">
                <div className="filter-page__top-row__section filter-page__top-row__section--sortbar">
                    <Sortbar />
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        window: state.common.window,
        searchQuery: state.pages.dealList.searchQuery,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        onRequestSearch: () => {
            return dispatch(requestSearch());
        },
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ToolbarPrice);
