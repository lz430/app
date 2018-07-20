import React from 'react';
import PropTypes from 'prop-types';
import R from 'ramda';
import SVGInline from 'react-svg-inline';
import zondicons from 'zondicons';
import { connect } from 'react-redux';
import {
    clearAllSecondaryFilters,
    toggleSearchFilter,
} from 'pages/deal-list/actions';
import { getSelectedFiltersByCategory } from '../selectors';

/**
 *
 */
class ToolbarSelectedFilters extends React.PureComponent {
    static propTypes = {
        onClearAllSecondaryFilters: PropTypes.func.isRequired,
        onToggleSearchFilter: PropTypes.func.isRequired,
        selectedFiltersByCategory: PropTypes.object.isRequired,
        filters: PropTypes.object.isRequired,
    };

    selectedFilters() {
        const blackListCategories = ['make', 'model', 'year'];

        return R.omit(
            blackListCategories,
            this.props.selectedFiltersByCategory
        );
    }

    /**
     * @param category
     * @param items
     */
    renderFilterCategory(category, items) {
        let allItems = this.props.filters[category];

        if (!allItems) {
            return null;
        }

        allItems = R.reject(item => {
            return !R.contains(item.value, items);
        }, allItems);

        const _this = this;
        return allItems.map(function(item) {
            return _this.renderFilterItem(category, item);
        });
    }

    /**
     *
     * @param category
     * @param item
     * @returns {*}
     */
    renderFilterItem(category, item) {
        return (
            <div className="filterbar__filter">
                {item.label}
                <SVGInline
                    height="10px"
                    width="10px"
                    className="filterbar__filter-x"
                    svg={zondicons['close']}
                    onClick={() =>
                        this.props.onToggleSearchFilter(category, item)
                    }
                />
            </div>
        );
    }

    render() {
        const selectedFilters = this.selectedFilters();

        /*
        if (!Object.keys(selectedFilters).length) {
            return false;
        }
        */

        return (
            <div className="filterbar">
                <SVGInline
                    height="20px"
                    width="20px"
                    className="filterbar__filter-icon"
                    svg={zondicons['filter']}
                />

                <div className="filterbar__filters">
                    {Object.keys(selectedFilters).map(key =>
                        this.renderFilterCategory(key, selectedFilters[key])
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
        filters: state.pages.dealList.filters,
        selectedFiltersByCategory: getSelectedFiltersByCategory(state),
    };
}

const mapDispatchToProps = dispatch => {
    return {
        onToggleSearchFilter: (category, item) => {
            return dispatch(toggleSearchFilter(category, item));
        },
        onClearAllSecondaryFilters: () => {
            return dispatch(clearAllSecondaryFilters());
        },
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ToolbarSelectedFilters);
