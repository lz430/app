import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Close from 'icons/zondicons/Close';

import { toggleSmallFiltersShown } from 'pages/deal-list/actions';

class MobileFilterClose extends React.PureComponent {
    static propTypes = {
        onToggleSmallFiltersShown: PropTypes.func.isRequired,
    };

    render() {
        return (
            <div className="filter-close">
                <Close
                    onClick={this.props.onToggleSmallFiltersShown}
                    className="filter-close__icon"
                    height="20px"
                    width="20px"
                />
            </div>
        );
    }
}

const mapStateToProps = () => {
    return {};
};

const mapDispatchToProps = dispatch => {
    return {
        onToggleSmallFiltersShown: () => {
            return dispatch(toggleSmallFiltersShown(false));
        },
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(MobileFilterClose);
