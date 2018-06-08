import React from 'react';
import { connect } from 'react-redux';
import * as Actions from 'actions/index';
import SVGInline from 'react-svg-inline';
import zondicons from 'zondicons';

class FilterClose extends React.PureComponent {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="filter-close">
                <SVGInline
                    onClick={this.props.toggleSmallFiltersShown}
                    className="filter-close__icon"
                    height="20px"
                    width="20px"
                    svg={zondicons['close']}
                />
            </div>
        );
    }
}

const mapStateToProps = (state, ownProps) => {
    return {
        filterPage: state.filterPage,
    };
};

export default connect(
    mapStateToProps,
    Actions
)(FilterClose);
