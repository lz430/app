import React from 'react';
import { connect } from 'react-redux';
import SVGInline from 'react-svg-inline';
import zondicons from 'zondicons';

import { toggleSmallFiltersShown } from 'apps/common/actions';

import PropTypes from 'prop-types';

class MobileFilterClose extends React.PureComponent {
    static propTypes = {
        onToggleSmallFiltersShown: PropTypes.func.isRequired,
    };

    render() {
        return (
            <div className="filter-close">
                <SVGInline
                    onClick={this.props.onToggleSmallFiltersShown}
                    className="filter-close__icon"
                    height="20px"
                    width="20px"
                    svg={zondicons['close']}
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
            return dispatch(toggleSmallFiltersShown());
        },
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(MobileFilterClose);
