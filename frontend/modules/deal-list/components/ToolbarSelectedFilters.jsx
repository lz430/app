import React from 'react';
import PropTypes from 'prop-types';
import { omit, reject, contains } from 'ramda';
import { connect } from 'react-redux';

import ToolbarSort from './ToolbarSort';

import {
    clearAllSecondaryFilters,
    toggleSearchFilter,
} from '../../deal-list/actions';

import { faTimes, faFilter } from '@fortawesome/pro-light-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

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
        const blackListCategories = ['make', 'model', 'style'];
        return omit(blackListCategories, this.props.selectedFiltersByCategory);
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

        allItems = reject(item => {
            return !contains(item.value.toString(), items);
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
            <div key={category + item.value} className="filterbar__filter">
                {item.label}
                <FontAwesomeIcon
                    icon={faTimes}
                    className="filterbar__filter-x"
                    onClick={() =>
                        this.props.onToggleSearchFilter(category, item)
                    }
                />
            </div>
        );
    }

    renderSelectedFilters() {
        const selectedFilters = this.selectedFilters();
        if (!Object.keys(selectedFilters).length) {
            return false;
        }
        return (
            <div className="selected-filters">
                <FontAwesomeIcon
                    icon={faFilter}
                    className="filterbar__filter-icon"
                />

                <div className="filterbar__filters">
                    {Object.keys(selectedFilters).map(key =>
                        this.renderFilterCategory(key, selectedFilters[key])
                    )}
                </div>

                <div className="filterbar__clear">
                    <span onClick={this.props.onClearAllSecondaryFilters}>
                        Clear Options
                    </span>
                </div>
            </div>
        );
    }

    render() {
        return (
            <div className="filterbar">
                {this.renderSelectedFilters()}
                <ToolbarSort />
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
