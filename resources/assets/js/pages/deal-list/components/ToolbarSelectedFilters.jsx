import React from 'react';
import PropTypes from 'prop-types';
import SVGInline from 'react-svg-inline';
import zondicons from 'zondicons';
import { connect } from 'react-redux';
import { clearAllSecondaryFilters } from 'pages/deal-list/actions';
import { getSelectedFiltersByCategory } from '../selectors';

/**
 *
 */
class ToolbarSelectedFilters extends React.PureComponent {
    static propTypes = {
        onClearAllSecondaryFilters: PropTypes.func.isRequired,
        selectedFiltersByCategory: PropTypes.object.isRequired,
    };

    constructor(props) {
        super(props);
        this.renderX = this.renderX.bind(this);
    }

    renderX() {
        return <span />;

        return (
            <SVGInline
                height="10px"
                width="10px"
                className="filterbar__filter-x"
                svg={zondicons['close']}
            />
        );
    }

    /**
     * @param category
     * @param items
     */
    renderFilterCategory(category, items) {
        if (category === 'make') {
            return;
        }

        return items.map(this.renderFilterItem);
    }

    /**
     * @param item
     * @returns {*}
     */
    renderFilterItem(item) {
        return <div className="filterbar__filter">{item}</div>;
    }

    render() {
        return (
            <div className="filterbar">
                <SVGInline
                    height="20px"
                    width="20px"
                    className="filterbar__filter-icon"
                    svg={zondicons['filter']}
                />

                <div className="filterbar__filters">
                    {Object.keys(this.props.selectedFiltersByCategory).map(
                        key =>
                            this.renderFilterCategory(
                                key,
                                this.props.selectedFiltersByCategory[key]
                            )
                    )}
                </div>

                <div className="filterbar__clear">
                    <a onClick={this.props.onClearAllSecondaryFilters}>
                        Clear Options
                    </a>
                </div>
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        selectedFiltersByCategory: getSelectedFiltersByCategory(state),
    };
}

const mapDispatchToProps = dispatch => {
    return {
        onClearAllSecondaryFilters: () => {
            return dispatch(clearAllSecondaryFilters());
        },
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ToolbarSelectedFilters);
